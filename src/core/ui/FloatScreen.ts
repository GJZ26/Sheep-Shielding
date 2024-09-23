import { MatchResume } from "../manager/GameManager";

export default class FloatScreen {
  public static Notification(
    target: HTMLElement,
    title: string,
    content: string,
    killAfter: number = 500,
    left: boolean = false
  ): void {
    const notification = document.createElement("div");
    if (left) {
      notification.style.right = "0";
      notification.style.textAlign = "right";
    }
    notification.id = "notify";
    const titleNoti = document.createElement("h1");
    titleNoti.className = "notitle";
    titleNoti.textContent = title;
    const contentNoti = document.createElement("p");
    contentNoti.className = "conoti";
    contentNoti.textContent = content;

    notification.appendChild(titleNoti);
    notification.appendChild(contentNoti);
    target.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, killAfter);
  }

  public static StatisticsScreen(
    target: HTMLElement,
    resume: MatchResume
  ): void {
    const screen = document.createElement("div");
    screen.id = "statistics";
    const title = document.createElement("h1");
    title.className = "statitle";
    const resumeString: Record<keyof MatchResume, string> = {
      rounds: "Rounds",
      timesDeath: "Times dead",
      sheepSaved: "Animals Saved",
      sheepKilled: "Animals Saved",
      wolfKilled: "Wild Animals Killed",
      timePlayingInSecond: "Time played",
      score: "Score",
    };

    title.textContent = "Game Over";
    screen.appendChild(title);
    for (let key of Object.keys(resume)) {
      const p = document.createElement("p");
      let data: any = resume[key as keyof MatchResume];
      if ((key as keyof MatchResume) === "timePlayingInSecond") {
        data = `${Math.round(data / 60)
          .toString()
          .padStart(2, "0")}:${Math.floor(data % 60)
          .toString()
          .padStart(2, "0")}`;
      }
      p.innerHTML = `<b>${resumeString[key as keyof MatchResume]}</b>: ${data}`;
      screen.appendChild(p);
    }

    const button = document.createElement("button");
    button.id = "restart";
    button.textContent = "Play again";
    button.onclick = () => {
      window.location.reload();
    };
    screen.appendChild(button);
    target.appendChild(screen);
  }
}
