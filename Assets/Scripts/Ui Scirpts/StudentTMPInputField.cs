using System;
using Mirror;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;

public class StudentTMPInputField : TMP_InputField
{
    private string _oldName;
    
    public override void OnDeselect(BaseEventData eventData)
    {
        LockedInNetworkManager netManager = (LockedInNetworkManager)NetworkManager.singleton;
        if (netManager.teacher != null)
        {
            if (String.IsNullOrEmpty(_oldName))
                netManager.teacher.AddStudentName(text);
            else 
                netManager.teacher.UpdateStudentName(_oldName, text);
        }
        
        _oldName = text;
        
        base.OnDeselect(eventData);
    }

    protected override void OnDestroy()
    {
        LockedInNetworkManager netManager = (LockedInNetworkManager)NetworkManager.singleton;
        if (netManager.teacher != null)
        {
            netManager.teacher.RemoveStudentName(text);
        }
        base.OnDestroy();
    }
}