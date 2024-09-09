import { createGlobalStyle } from 'styled-components';
import {
  colorBlackBackground,
  colorBlue,
  colorBlueHover,
  colorDarkFieldsBorder,
  colorDustyWhite,
  colorWhite,
} from '@/utils/palette';
import {
 borderRight, left, right, paddingRight, 
} from '@/utils/directions';

const TimepickerStyles = createGlobalStyle`
  .rc-time-picker {
    width: 100%;
  }

  .rc-time-picker-input {
    border-radius: 0;
  }

  .rc-time-picker-panel {
    padding-top: 3px;
  }

  .rc-time-picker-panel-input-wrap {
    display: none;
  }

  .rc-time-picker-panel-inner {
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.05);
    border: none;
    border-radius: 0;
    margin-top: 32px;
  }

  .rc-time-picker-panel-select {
    overflow: hidden;
    ${borderRight}: 1px solid #eff1f5;

    ul {
      ${paddingRight}: 30px;
      overflow-y: scroll;
      overflow-x: hidden;
      width: 86px;
      height: 144px;
    }

    li {
      padding: 0;
      text-align: center;
      transition: 0.3s;
      width: 56px;
    }
  }

  li.rc-time-picker-panel-select-option-selected {
    background: ${colorBlue};
    color: ${colorWhite};

    &:hover {
      background: ${colorBlueHover};
    }
  }

  .rc-time-picker-clear {
    ${right}: 6px;
    ${left}: auto;
  }

  .rc-time-picker-panel.dark {

    .rc-time-picker-panel-inner {
      background: ${colorBlackBackground};
      color: ${colorDustyWhite};

      .rc-time-picker-panel-select li:hover {
        background: ${colorDarkFieldsBorder};
        color: ${colorWhite};
      }

      li.rc-time-picker-panel-select-option-selected {
        background: ${colorDarkFieldsBorder};
        color: ${colorWhite};
      }
    }
  }
`;

export default TimepickerStyles;
