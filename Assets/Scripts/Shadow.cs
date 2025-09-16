using UnityEngine;

[ExecuteAlways]
public class Shadow : MonoBehaviour
{
    public RectTransform Target;
    private RectTransform _rectTransform;
    private UIData _data;

    private void Start()
    {
        _rectTransform = GetComponent<RectTransform>();
        _data = UIManager.Instance.config;
    }

    private void Update()
    {
        if (Target == null) return;

        Vector3 targetWorldPos = Target.position;
        targetWorldPos += new Vector3(_data.ShadowOffset, -_data.ShadowOffset, 0f);
        _rectTransform.localPosition = _rectTransform.parent.InverseTransformPoint(targetWorldPos);

        _rectTransform.sizeDelta = Target.sizeDelta;
    }
}