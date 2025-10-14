using System.Collections.Generic;
using Mirror;
using UnityEngine;

public class Teacher : NetworkBehaviour
{
    private static List<string> _joinCodes = new List<string>();
    public string JoinCode {get; private set;}
    
    public Dictionary<string, Student> StudentAttendance = new Dictionary<string, Student>();
    [SyncVar] public Exam Exam;

    public void SetJoinCode(string code)
    {
        _joinCodes.Add(code);
        JoinCode = code;
    }
    
    public void AddStudentName(string name)
    {
        if (StudentAttendance.ContainsKey(name))
            return;
        StudentAttendance.Add(name, null);
    }

    public void RemoveStudentName(string name)
    {
        if (!StudentAttendance.ContainsKey(name))
            return;
        if (StudentAttendance[name] != null)
            StudentAttendance[name].Kick();
        StudentAttendance.Remove(name);
    }

    public void UpdateStudentName(string oldName, string newName)
    {
        Student student = StudentAttendance[oldName];
        StudentAttendance.Remove(oldName);
        StudentAttendance.Add(newName, student);
    }
    
    public void RemoveJoinCode() => _joinCodes.Remove(JoinCode);
}
