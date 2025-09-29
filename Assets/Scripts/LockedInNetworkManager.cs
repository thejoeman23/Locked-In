using Mirror;
using UnityEngine;

public class LockedInNetworkManager : NetworkManager
{
    public Teacher teacher;

    public override void OnServerAddPlayer(NetworkConnectionToClient conn)
    {
        if (numPlayers == 0)
        {
            // Host/teacher joins first
            base.OnServerAddPlayer(conn);
            
            teacher = conn.identity.GetComponent<Teacher>();
        }
        else
        {
            // Students
            base.OnServerAddPlayer(conn);

            Student student = conn.identity.GetComponent<Student>();
            if (student != null)
            {
                teacher.students.Add(student);
            }
        }
    }
}