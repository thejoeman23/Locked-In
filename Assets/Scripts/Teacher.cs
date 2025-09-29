using System.Collections.Generic;
using Mirror;
using UnityEngine;

public class Teacher : NetworkBehaviour
{
    private static List<int> _joinCodes = new List<int>();
    public int joinCode;
    
    public List<Student> students = new List<Student>();
    [SyncVar] public string essayQuestion;
    [SyncVar] public float timeLimit;

    void Awake()
    {
        int code;
        do
        {
            code = Random.Range(1000, 9999);
        } while (_joinCodes.Contains(code));
        
        joinCode = code;
        _joinCodes.Add(joinCode);
    }
}
