using System;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

/// <summary>
/// A custom TMP_InputField that removes the placeholder text when the user first selects the field.
/// If the field is left empty it resets the placeholder text
/// </summary>
[RequireComponent(typeof(TMP_InputField))]
public class CustomTMPInputField : TMP_InputField
{
    private bool firstTime = true;
    private string placeholderText;
    
    // Override OnSelect to check if it's the first time its been selected. If so -> clear text.
    public override void OnSelect(BaseEventData eventData)
    {
        base.OnUpdateSelected(eventData);

        placeholderText = text;
        text = firstTime ? "" : text;
    }

    // Ovveride OnDeselect to reset the placeholder text if the user failed to input a value
    public override void OnDeselect(BaseEventData eventData)
    {
        base.OnDeselect(eventData);
        
        if (String.IsNullOrEmpty(text))
            text = placeholderText;
    }
}