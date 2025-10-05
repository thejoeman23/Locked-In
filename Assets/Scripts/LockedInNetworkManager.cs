using System;
using System.Collections;
using System.Net;
using Mirror;
using TMPro;
using UnityEngine;

public class LockedInNetworkManager : NetworkManager
{
    public Teacher teacher;

    public override void OnServerAddPlayer(NetworkConnectionToClient conn)
    {
        base.OnServerAddPlayer(conn);

        // Skip teacher initialization if this is the host
        if (conn.identity.gameObject.GetComponent<Teacher>() != null)
            return;

        Student student = conn.identity.GetComponent<Student>();
        if (student != null)
            teacher.students.Add(student);
    }

    public override void OnStartHost()
    {
        base.OnStartHost();

        // Add teacher component to the host player
        if (NetworkClient.connection != null && NetworkClient.connection.identity != null)
        {
            teacher = NetworkClient.connection.identity.gameObject.AddComponent<Teacher>();

            string ip = NetworkManager.singleton.networkAddress;
            ushort port = (ushort)UnityEngine.Random.Range(0, 65535);
            GetComponent<TelepathyTransport>().port = port;

            teacher.SetJoinCode(JoinCode.Encode(ip, port));
        }
    }
    

    public override void OnStopServer()
    {
        teacher.RemoveJoinCode();
        base.OnStopHost();
    }

    public void JoinStudent(TMP_InputField inputField)
    {
        string code = inputField.text.Trim().ToUpperInvariant();
        Debug.Log($"Join code entered: {code}");

        try
        {
            (string hostIP, ushort hostPort) = JoinCode.Decode(code);

            // Detect if host is on the same machine
            string localIP = GetLocalIPAddress();
            string[] localParts = localIP.Split('.');
            string[] hostParts = hostIP.Split('.');
            if (localParts.Length == 4 && hostParts.Length == 4 && localParts[3] == hostParts[3]) // same last octet
            {
                hostIP = "127.0.0.1"; // use loopback for same-machine host
            }

            singleton.networkAddress = hostIP;

            // DO NOT set TelepathyTransport.port for client; it will use ephemeral port

            StartCoroutine(TryConnect(hostIP, hostPort));
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to join: {e.Message}");
        }
    }
    
    IEnumerator TryConnect(string hostIP, ushort hostPort)
    {
        TelepathyTransport transport = GetComponent<TelepathyTransport>();
        transport.port = hostPort;

        int maxAttempts = 5;
        int attempt = 0;

        while (attempt < maxAttempts)
        {
            if (NetworkClient.active)
            {
                Debug.Log("Client already active, shutting down before reconnecting.");
                NetworkClient.Shutdown();
                yield return null; // wait one frame
            }

            StartClient();

            float timeout = 1f;
            float timer = 0f;
            while (timer < timeout)
            {
                if (NetworkClient.isConnected)
                    yield break; // success
                timer += Time.deltaTime;
                yield return null;
            }

            attempt++;
            Debug.LogWarning($"Connection attempt {attempt} failed, retrying...");
        }

        Debug.LogError("Failed to connect to host after multiple attempts.");
    }
    
    private string GetLocalIPAddress()
    {
        foreach (var ip in Dns.GetHostAddresses(Dns.GetHostName()))
        {
            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                return ip.ToString();
            }
        }
        return "127.0.0.1"; // fallback
    }
}