using System.Collections;
using UnityEngine;

[ExecuteAlways]
public class Shadow : MonoBehaviour
{
    public RectTransform Target;
    private RectTransform _rectTransform;
    private UIData _data;
    
    private void Awake()
    {
        _data = UIManager.Instance.config;
    }

    private void Start()
    {
        _rectTransform = GetComponent<RectTransform>();
    }

    private void Update()
    {
        if (_data == null)
            return;
        
        if (Target == null) return;

        Vector3 targetWorldPos = Target.position;
        targetWorldPos += new Vector3(_data.ShadowOffset, -_data.ShadowOffset, 0f);
        _rectTransform.localPosition = _rectTransform.parent.InverseTransformPoint(targetWorldPos);

        _rectTransform.sizeDelta = Target.sizeDelta;
    }
}