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

        // If this is the host player and teacher hasn't been assigned yet
        if (conn.identity.gameObject.GetComponent<Teacher>() == null && teacher == null)
        {
            teacher = conn.identity.gameObject.AddComponent<Teacher>();

            TelepathyTransport transport = GetComponent<TelepathyTransport>();
            string ip = networkAddress;
            ushort port = transport.port;
            teacher.SetJoinCode(JoinCode.Encode(ip, port));
        }

        // Add students
        Student student = conn.identity.GetComponent<Student>();
        //if (student != null && teacher != null)
            //teacher.StudentAttendance.Add();
    }

    public void BeginHost()
    {
        TelepathyTransport transport = GetComponent<TelepathyTransport>();
        transport.port = (ushort)UnityEngine.Random.Range(2000, 9999);

        // Bind host to local LAN IP instead of localhost
        networkAddress = GetLocalIPAddress(); // returns e.g. 172.30.30.1
        Debug.Log($"Host will listen on {networkAddress}:{transport.port}");

        StartHost();
    }

    public void JoinStudent(TMP_InputField inputField)
    {
        string code = inputField.text.Trim().ToUpperInvariant();

        (string hostIP, ushort hostPort) = JoinCode.Decode(code);
        Debug.Log($"Join code entered: {code}\nTrying to connect to {hostIP}: {hostPort}");
        

        // If the decoded IP looks like just a last octet (e.g. "105"), rebuild it
        if (!hostIP.Contains("."))
        {
            string prefix = GetLocalPrefix(); // e.g. "192.168.0."
            hostIP = prefix + hostIP;
            Debug.Log($"Reconstructed full IP: {hostIP}");
        }

        networkAddress = hostIP;
        GetComponent<TelepathyTransport>().port = hostPort;
        StartClient();
    }
    
    private string GetLocalPrefix()
    {
        foreach (var ip in Dns.GetHostAddresses(Dns.GetHostName()))
        {
            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                string[] parts = ip.ToString().Split('.');
                if (parts.Length == 4)
                    return $"{parts[0]}.{parts[1]}.{parts[2]}.";
            }
        }
        return "192.168.0."; // fallback prefix
    }
    
    public string GetLocalIPAddress()
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
    
    public override void OnClientConnect()
    {
        base.OnClientConnect();
        Debug.Log("✅ Client successfully connected to server!");
    }

    public override void OnClientDisconnect()
    {
        base.OnClientDisconnect();
        Debug.Log("❌ Client disconnected or failed to connect.");
    }
}