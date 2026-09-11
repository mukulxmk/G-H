export type GameFlowState =
    | "home"
    | "misssion"
    | "travel"
    | "outcome"

export class GameFlow {
    private state: GameFlowState = "home";

    getState() {
        return this.state;
    }

    transitionTo(state: GameFlowState) {
        this.state = state;
    }
}