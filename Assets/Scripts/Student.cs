using Mirror;
using UnityEngine;

public class Student : NetworkBehaviour
{
    [SyncVar] public bool isIdle;
    [SyncVar] public Exam exam;

    public string GetExamJsonForSubmission()
    {
        return JsonUtility.ToJson(exam);
    }
    
    public void Kick() => NetworkManager.singleton.StopClient();
}
   