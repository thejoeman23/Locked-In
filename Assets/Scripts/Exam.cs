using System.Collections.Generic;
using UnityEngine;

namespace DefaultNamespace
{
    [CreateAssetMenu(fileName = "Exam", menuName = "Exam", order = 0)]
    public class Exam : ScriptableObject
    {
        public List<ExamQuestion> questions = new List<ExamQuestion>();
        public string name;
        public string period;
        public string student;
        public string date;
        public string timeCompleted;
        public string teacherName;
    }
}