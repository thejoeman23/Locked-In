using System.Collections.Generic;
using UnityEngine;

public class ExamQuestion : ScriptableObject
{
    public string question;
    public string imageBase64; // replaces imagePath
    public Vector2 size;
    public ImageLocation position;

    public enum ImageLocation
    {
        OnLeft,
        OnRight,
        Above,
        Below
    }

    public Sprite GetImage()
    {
        if (string.IsNullOrEmpty(imageBase64)) return null;

        byte[] bytes = System.Convert.FromBase64String(imageBase64);
        Texture2D tex = new Texture2D(2, 2);
        tex.LoadImage(bytes);

        return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height), Vector2.one * 0.5f);
    }
}

[CreateAssetMenu(fileName = "MCQuestion", menuName = "Questions/MCQuestion", order = 0)]
public class MCQuestion : ExamQuestion
{
    public List<MCChoice> options;
    public List<MCChoice> choices;
    public bool canChooseMultiple;
}

public class MCChoice
{
    public string option;
    public bool isCorrect;
}

[CreateAssetMenu(fileName = "MCQuestion", menuName = "Questions/SAQuestion", order = 0)]
public class SAQuestion : ExamQuestion
{
    public int wordLimit;
    public string answer;
}

[CreateAssetMenu(fileName = "EssayQuestion", menuName = "Questions/EssayQuestion", order = 0)]
public class EssayQuestion : ExamQuestion
{
    public int wordLimit;
    public string answer;
}