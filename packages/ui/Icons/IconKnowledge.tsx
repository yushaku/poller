type Props = React.SVGProps<SVGSVGElement> & {};

export const IconKnowledge = ({ color = "#888888", ...props }: Props) => {
  return (
    <svg
      width="60px"
      height="60px"
      viewBox="0 0 60 60"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        id="outlined"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Marketing_sliced"
          transform="translate(-720.000000, -120.000000)"
        ></g>
        <g
          id="Marketing"
          transform="translate(-712.000000, -120.000000)"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g id="Desk" transform="translate(716.000000, 115.000000)">
            <path
              d="M8.15678015,10.4405946 C7.81773976,9.38915597 8.39730843,8.81230601 9.44669123,9.15068349 L33.1790439,16.8032711 C34.2304825,17.1423115 35.3583514,18.2715733 35.6967289,19.3209561 L43.3493165,43.0533088 C43.6883569,44.1047474 43.1087882,44.6815973 42.0594054,44.3432199 L18.3270527,36.6906322 C17.2756141,36.3515918 16.1477453,35.2223301 15.8093678,34.1729473 L8.15678015,10.4405946 Z"
              id="Rectangle-1623"
              transform="translate(25.753048, 26.746952) rotate(-45.000000) translate(-25.753048, -26.746952) "
            ></path>
            <path d="M39,34 L39,52" id="Line"></path>
            <circle id="Oval-1441" cx="39" cy="55" r="3"></circle>
            <path d="M10,27 L14,25" id="Line"></path>
            <path d="M14,29 L18,27" id="Line"></path>
            <path
              d="M43,32 L43,45 C43,45 36.4469738,49 26,49 C15.5530262,49 9,45 9,45 L9,32"
              id="Rectangle-1624"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};
