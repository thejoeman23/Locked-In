using System;
using System.Net;
using System.Text;

public static class JoinCode
{
    // Characters used for encoding (1-9 + A-Z)
    private const string Alphabet = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Encode last octet of IP + port into 6-char code
    public static string Encode(string ip, int port)
    {
        if (ip.Equals("localhost", StringComparison.OrdinalIgnoreCase))
        {
            ip = "127.0.0.1";
        }

        if (!IPAddress.TryParse(ip, out IPAddress ipAddress) || ipAddress.AddressFamily != System.Net.Sockets.AddressFamily.InterNetwork)
        {
            throw new FormatException($"Invalid IPv4 address: {ip}");
        }

        byte[] ipBytes = ipAddress.GetAddressBytes();

        if (port < 0 || port > 65535)
        {
            throw new ArgumentOutOfRangeException(nameof(port), "Port must be between 0 and 65535");
        }

        // Convert port to network byte order (big-endian)
        byte[] portBytes = new byte[2];
        portBytes[0] = (byte)((port >> 8) & 0xFF);
        portBytes[1] = (byte)(port & 0xFF);

        // Combine into 3 bytes: 1 for last octet of IP, 2 for port
        byte[] combined = new byte[3];
        combined[0] = ipBytes[3]; // last octet
        combined[1] = portBytes[0];
        combined[2] = portBytes[1];

        // Convert to integer (24 bits max)
        ulong value = 0;
        for (int i = 0; i < combined.Length; i++)
        {
            value = (value << 8) | combined[i];
        }

        // Base36 encode to 6 characters (because 36^6 > 2^24)
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) // force 6 chars
        {
            int index = (int)(value % 36);
            code.Insert(0, Alphabet[index]);
            value /= 36;
        }

        return code.ToString();
    }

    // Decode 6-char code back into last octet + port, reconstruct IP prefix
    public static (string ip, ushort port) Decode(string code)
    {
        if (code == null || code.Length != 6)
        {
            throw new FormatException("Code must be exactly 6 characters long.");
        }

        ulong value = 0;
        foreach (char c in code)
        {
            int index = Alphabet.IndexOf(c);
            if (index == -1)
            {
                throw new FormatException($"Invalid character '{c}' in code.");
            }
            value = value * 36 + (ulong)index;
        }

        byte[] combined = new byte[3];
        for (int i = 2; i >= 0; i--)
        {
            combined[i] = (byte)(value & 0xFF);
            value >>= 8;
        }

        byte lastOctet = combined[0];
        byte[] portBytes = new byte[2];
        portBytes[0] = combined[1];
        portBytes[1] = combined[2];

        string ip = GetLocalPrefix() + lastOctet;

        // Convert port bytes from network byte order (big-endian) to host order
        int port = (portBytes[0] << 8) | portBytes[1];

        return (ip, (ushort)port);
    }
    
    static string GetLocalPrefix()
    {
        foreach (var ip in Dns.GetHostAddresses(Dns.GetHostName()))
        {
            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                string[] parts = ip.ToString().Split('.');
                return $"{parts[0]}.{parts[1]}.{parts[2]}.";
            }
        }
        return "192.168.0."; // fallback
    }
}