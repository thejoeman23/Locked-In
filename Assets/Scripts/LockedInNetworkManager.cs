using System.Collections.Generic;
using Mirror;

public class LockedInNetworkManager : NetworkManager
{
    public List<Student> students;

    public override void OnServerAddPlayer(NetworkConnectionToClient conn)
    {
        base.OnServerAddPlayer(conn);

        Student student = conn.identity.GetComponent<Student>();
        if (student != null)
        {
            students.Add(student);
        }
    }
}