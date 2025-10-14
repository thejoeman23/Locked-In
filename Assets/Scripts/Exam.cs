using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "Exam", menuName = "Exam", order = 0)]
public class Exam : ScriptableObject
{
    public List<ExamQuestion> Questions = new List<ExamQuestion>();
    public string Name;
    public string Period;
    public string Student;
    public string Date;
    public string TimeCompleted;
    public string TeacherName;
    public int CloseTime;
}