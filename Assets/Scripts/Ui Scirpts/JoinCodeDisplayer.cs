using Mirror;
using TMPro;
using UnityEngine;

[RequireComponent(typeof(TextMeshProUGUI))]
public class JoinCodeDisplayer : MonoBehaviour
{
    void Update()
    {
        var netManager = (LockedInNetworkManager)NetworkManager.singleton;
        if (netManager.teacher != null)
        {
            GetComponent<TextMeshProUGUI>().text = $"{netManager.networkAddress} \n{netManager.transform.GetComponent<TelepathyTransport>().port}\n{netManager.teacher.JoinCode}";
        }
    }
}
