import { actionTypes } from "./actionTypes";

export const setCurSongId = (sid) => ({
    type: actionTypes.SET_CUR_MUSIC,
    sid
})
export const play = (flag) => ({
    type: actionTypes.PLAY,
    flag
})
export const atAlbum =(flag) => ({
    type: actionTypes.AT_ALBUM,
    flag
});
export const playList =(songs) => ({
    type: actionTypes.PLAY_LIST,
    songs
});