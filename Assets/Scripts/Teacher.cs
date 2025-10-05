using System.Collections.Generic;
using Mirror;
using UnityEngine;

public class Teacher : NetworkBehaviour
{
    private static List<string> _joinCodes = new List<string>();
    public string JoinCode {get; private set;}
    
    public List<Student> students = new List<Student>();
    [SyncVar] public string essayQuestion;
    [SyncVar] public float timeLimit;

    public void SetJoinCode(string code)
    {
        _joinCodes.Add(code);
        JoinCode = code;
    }
    
    public void RemoveJoinCode() => _joinCodes.Remove(JoinCode);
}
