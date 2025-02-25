import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { Sun, Thunder, Warning } from "../../assets";
import { livePrompt } from "../../redux/messages";
import { examples, capabilities, limitations } from "../../config/new";
import "./style.scss";

const Card = ({ icon, title, items, onClick }) => (
  <div className="inner">
    <div className="card flex flex-col items-center">
      {icon}
      <h4 className="currentColor">{title}</h4>
    </div>
    {items.map((item, index) => (
      <div
        key={index}
        className={`card card-bg ${onClick ? "hover" : ""}`}
        onClick={() => onClick?.(item.text)}
      >
        <p className="currentColor">
          {item.text} {onClick && "→"}
        </p>
      </div>
    ))}
  </div>
);

const New = memo(() => {
  const dispatch = useDispatch();

  const handleExampleClick = (text) => {
    dispatch(livePrompt(text));
  };

  return (
    <div className="New">
      <div>
        <h1 className="title currentColor">Genify</h1>
      </div>

      <div className="flex">
        <Card
          icon={<Sun />}
          title="Examples"
          items={examples}
          onClick={handleExampleClick}
        />

        <Card icon={<Thunder />} title="Capabilities" items={capabilities} />

        <Card icon={<Warning />} title="Limitations" items={limitations} />
      </div>
    </div>
  );
});

export default New;