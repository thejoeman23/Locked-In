using Mirror;
using UnityEngine;

public class Student : NetworkBehaviour
{
    [SyncVar] public string essay;
    [SyncVar] public bool isIdle;
    [SyncVar] public string studentName;

    [Command]
    public void UpdateEssay(string text)
    {
        essay = text;
    }

    [Command]
    public void UpdateIsIdle(bool idle)
    {
        isIdle = idle;
    }

    [Command]
    public void SetName(string name)
    {
        studentName = name;
    }
    
    [Command]
    public void NotifyTeacherOfTabOut()
    {
        // do something
    }
}
