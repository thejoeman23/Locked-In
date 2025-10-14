using System;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;


public class RemoveStudentButton : Button
{
    public override void OnPointerClick(PointerEventData eventData)
    {
        Destroy(transform.parent.gameObject);
        base.OnPointerClick(eventData);
    }
}