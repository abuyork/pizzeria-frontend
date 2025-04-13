import React from "react";

export default function Advertisement() {
  return (
    <div className="ads-restaurant-frame">
      <div className="video-container">
        <video
          className="ads-video"
          autoPlay={true}
          loop
          muted
          playsInline
          data-video-media=""
        >
          <source type="video/mp4" src="video/pizads.mp4" />
        </video>
      </div>
    </div>
  );
}