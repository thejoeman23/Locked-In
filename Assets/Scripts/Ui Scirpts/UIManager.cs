using System;
using UnityEngine;
using DG.Tweening;

public class UIManager : MonoBehaviour
{
    public enum MenuState
    {
        Default,
        CodeSelection
    }
    
    public static UIManager Instance { get; private set; }
    
    [Header("UI Tweening Settings")]
    [SerializeField] public UIData config;
    
    [Header("Different Screens")]
    [SerializeField] private GameObject menuScreen;
    [SerializeField] private GameObject codeSelectionScreen;
    
    MenuState currentState = MenuState.Default;
    GameObject currentScreen;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject); // kill duplicates
            return;
        }

        Instance = this;
        DontDestroyOnLoad(gameObject); // survive scene changes
    }

    private void Start() => currentScreen = menuScreen;

    public void GoToMain() => ChangeState(MenuState.Default);
    
    public void GoToCodeSelection() => ChangeState(MenuState.CodeSelection);
    
    private void ChangeState(MenuState newState)
    {
        if (currentState == newState) return;

        GameObject newScreen = GetNewScreenRect(newState);
        if (newScreen == null) return;

        RectTransform currentRect = currentScreen?.GetComponent<RectTransform>();
        RectTransform newRect = newScreen.GetComponent<RectTransform>();

        float screenWidth = Screen.width;

        if (currentRect != null)
        {
            // Move current screen out to the left
            currentRect.DOAnchorPosX(-screenWidth, config.screenTweenDuration).SetEase(config.screenTweenEase);
        }

        // Set new screen position off-screen right before tweening in
        newRect.anchoredPosition = new Vector2(screenWidth, newRect.anchoredPosition.y);
        newScreen.SetActive(true);

        // Move new screen in to position 0
        newRect.DOAnchorPosX(0, config.screenTweenDuration).SetEase(config.screenTweenEase).OnComplete(() =>
        {
            if (currentScreen != null && currentScreen != newScreen)
            {
                currentScreen.SetActive(false);
            }
            currentScreen = newScreen;
            currentState = newState;
        });
    }
    
    private GameObject GetNewScreenRect(MenuState newState)
    {
        GameObject newScreen = newState switch
        {
            MenuState.Default => menuScreen,
            MenuState.CodeSelection => codeSelectionScreen,
            _ => null
        };

        return newScreen;
    }
}