using DG.Tweening;
using UnityEngine;

[CreateAssetMenu(fileName = "UIData", menuName = "Data", order = 0)]
public class UIData : ScriptableObject
{
    [Header("Shadow Settings")]
    [SerializeField] public float ShadowOffset = 5;

    [Header("Screen Tweening Settings")]
    [SerializeField] public float screenTweenDuration = 0.5f;
    [SerializeField] public Ease screenTweenEase = Ease.OutQuad;
}
