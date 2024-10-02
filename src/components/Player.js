import { React, useEffect, useState, useRef } from "react";
import * as apis from "../apis";
import icons from "../ultis/icon";
import * as actions from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useCookies } from 'react-cookie';
const Player = () => {
  
  const {
    FaRegHeart,
    FaHeart,
    BsThreeDots,
    MdSkipNext,
    MdSkipPrevious,
    CiShuffle,
    IoPlaySharp,
    IoPauseSharp,
    LuRepeat,
  } = icons;
  const thumbRef = useRef();
  const trackRef = useRef();
  const dispatch = useDispatch();
  const { curSongId, isPlaying } = useSelector((state) => state.music);
  // console.log(isPlaying)
  const [songInfo, setSongInfo] = useState(null);
  // console.log("curSongId: ", curSongId);
  const [audio, setAudio] = useState(new Audio());
  const [curTime, setCurTime] = useState(null);
  // console.log(audioEl)
  const { atAlbum } = useSelector((state) => state.music);
  console.log(atAlbum);
  const { songs } = useSelector((state) => state.music);
  console.log(songs);
 const [cookies, setcookies] = useState( useCookies(['zmp3_rqid']));
console.log(cookies)
  //get detailsong and song when click song item
  useEffect(() => {

   
    const fetchDetailSong = async () => {
      const [res1, res2] = await Promise.all([
        apis.getDetailSong(curSongId),
        apis.getSong(curSongId),
      ]);
      console.log("res", res1);
      console.log(res2);
      if (res1?.data?.err === 0) {
        //get song infor when click
        setSongInfo(res1.data.data);
      }
      if (res2?.data?.err !== 0) {
        //set src for audio tag
        audio.pause();

        
        try {
          const url = res2.data.url;
          const res = await axios
            .get(`${url.split("https://zingmp3.vn")[1]}`, {
              withCredentials: true,
              credentials: 'include',
              headers: {},
            })
            .then((response) => {
              console.log("reshead",response.headers)
              console.log("Response:", response);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
            console.log("res",res)
        } catch (error) {
          console.error("Error:", error);
        }

        // setAudio(new Audio(url));
        console.log("audio", audio);
        // console.log(url.data)
        if (isPlaying) {
          audio.load();
        }
      } else {
        //err with song (NO PLAY)
        audio.pause();
        setAudio(new Audio());
        audio.pause();
        setCurTime(0);
        thumbRef.current.style.cssText = `right:100%`;
        dispatch(actions.play(false));
        console.log(songInfo);
        toast.warn(res2?.data.msg);
      }
      // console.log(songInfo);
    };
    fetchDetailSong();
  }, [curSongId]);

  //Operations with song when clicking on songItem =>change audio tag
  const intervalId = useRef(null);
  useEffect(() => {
    // audio.load();
    if (isPlaying) {
      // console.log(isPlaying)
      audio.play();
      intervalId.current = setInterval(() => {
        // console.log(isPlaying)
        const percent =
          Math.round((audio.currentTime * 10000) / songInfo.duration) / 100;
        console.log(percent);
        thumbRef.current.style.cssText = `right: ${100 - percent}%`;
        setCurTime(Math.round(audio.currentTime));
        console.log(curTime, songInfo.duration);
      }, 200);
    }
    return () => clearInterval(intervalId.current);
  }, [audio, isPlaying]);

    
  const handTogglePlayMusic = () => {
    if (isPlaying) {
      audio.pause();
      dispatch(actions.play(false));
    } else {
      dispatch(actions.play(true));
      audio.play();
    }
  };
  const handClickProgressbar = (e) => {
    const trackRect = trackRef.current.getBoundingClientRect();
    console.log(trackRect);
    const percent =
      Math.round(((e.clientX - trackRect.left) * 10000) / trackRect.width) /
      100;

    console.log(percent);
    thumbRef.current.style.cssText = `right: ${100 - percent}%`;

    audio.currentTime = (percent * songInfo.duration) / 100;
  };
  const handNextSong = () => {
    const currentSongIndex = songs?.findIndex(
      (item) => item?.encodeId === curSongId
    );

    console.log(currentSongIndex);
    if (currentSongIndex >= 0 && currentSongIndex < songs?.length - 1) {
      const nextSong = songs[currentSongIndex + 1];
      if (nextSong) {
        dispatch(actions.setCurSongId(nextSong.encodeId));
      }
    }
    console.log(curSongId);
  };
  const handPreviosSong = () => {
    const curSongIndex = songs?.findIndex(
      (item) => item?.encodeId === curSongId
    );
    if (0 < curSongIndex && curSongIndex <= songs?.length - 1) {
      const previosSong = songs[curSongIndex - 1];
      if (previosSong) {
        dispatch(actions.setCurSongId(previosSong.encodeId));
      }
    }
  };
  return (
    <div className="flex px-5 h-full  ">
      <div className="w-[30%] flex  py-[20px] flex-auto items-center border gap-3 border-black">
        <img
          className="w-16 h-16 object-cover rounded-md"
          src={songInfo?.thumbnail}
          alt="thumbnail"
        ></img>
        <div className="flex flex-col gap-[3px]">
          <span className="font-semibold text-gray-700 text-sm">
            {songInfo?.title}{" "}
          </span>
          <span className="text-gray-500 text-xs">{songInfo?.artistsName}</span>
        </div>
        <div className="flex gap-4 pl-2">
          <span>
            {" "}
            <FaRegHeart size={16} />{" "}
          </span>
          <span>
            {" "}
            <BsThreeDots size={16} />
          </span>
        </div>
      </div>
      <div className="min-w-[40vw] flex flex-col flex-auto border border-red-400 py-[20px] gap-2 justify-center items-center">
        <div className="flex gap-8 justify-center items-center pt-[4px] ">
          <span
            title="Bật phát ngẫu nhiên"
            className="opacity-[0.6] cursor-pointer"
          >
            <CiShuffle size={20} />{" "}
          </span>
          <span
            className={`${
             atAlbum && curSongId !== songs[0]?.encodeId
                ? "cursor-pointer"
                : "opacity-[0.6] cursor-pointer"
            }`}
            onClick={handPreviosSong}
          >
            <MdSkipPrevious size={24} />{" "}
          </span>
          <span
            className="rounded-full border border-slate-800 opacity-[0.8] p-1 cursor-pointer transition duration-200 ease-in-out hover:text-[#208888]"
            onClick={handTogglePlayMusic}
          >
            {isPlaying && songInfo?.duration !== curTime ? (
              <IoPauseSharp size={24} />
            ) : (
              <IoPlaySharp size={24} />
            )}
          </span>
          <span
            className={`${
              atAlbum && curSongId !== songs[songs?.length - 1].encodeId
                ? "cursor-pointer"
                : "opacity-[0.6] cursor-pointer"
            }`}
            onClick={handNextSong}
          >
            <MdSkipNext size={24} />{" "}
          </span>
          <span
            title="Bật phát tất cả"
            className="opacity-[0.6] cursor-pointer"
          >
            <LuRepeat size={20} />{" "}
          </span>
        </div>
        <div className="flex w-full justify-center gap-4 items-center ">
          <span>{moment.utc(curTime * 1000).format("mm:ss")}</span>
          <div
            ref={trackRef}
            className=" w-3/5 hover:h-[8px] h-[6px] cursor-pointer border rounded-l-full rounded-r-full relative bg-[rgba(0,0,0,0.1)]"
            onClick={handClickProgressbar}
          >
            <div
              ref={thumbRef}
              className="absolute top-0 left-0 bottom-0 border rounded-l-full rounded-r-full  bg-[#0e8080]"
            ></div>
          </div>
          <span>{moment.utc(songInfo?.duration * 1000).format("mm:ss")}</span>
        </div>
      </div>
      <div className="w-[30%] py-[20px] flex justify-end gap-8  items-center">
        <span> c</span>
        <span> c</span>
        <span> c</span>
        <span> c</span>
        <span> c</span>
        <span> c</span>
        <span> c</span>
      </div>
    </div>
  );
};

export default Player;
