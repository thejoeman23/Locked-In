using TMPro;
using UnityEngine;

[RequireComponent(typeof(TMP_InputField))]
public class Join_Code_TMP : MonoBehaviour
{
    TMP_InputField inputField;

    void Start()
    {
        inputField = GetComponent<TMP_InputField>();
        
    }
    
    
}