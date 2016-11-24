export function GetPositionByDirection(pos: RoomPosition, direction: number): RoomPosition {
    // TODO: Handle the case where the room changes
    let newPos = pos;
    switch (direction) {
        case (TOP_LEFT):
            newPos.y--;
            newPos.x--;
            break;
        case (TOP):
            newPos.y--;
            break;
        case (TOP_RIGHT):
            newPos.y--;
            newPos.x++;
            break;
        case (LEFT):
            newPos.x--;
            break;
        case (RIGHT):
            newPos.x++;
            break;
        case (BOTTOM_LEFT):
            newPos.y++;
            newPos.x--;
            break;
        case (BOTTOM):
            newPos.y++;
            break;
        case (BOTTOM_RIGHT):
            newPos.y++;
            newPos.x++;
            break;
    }

    return newPos;
}
