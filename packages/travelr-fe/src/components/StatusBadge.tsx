import Typography from '@material-ui/core/Typography';
import IconComment from '@material-ui/icons/Comment';
import IconView from '@material-ui/icons/Visibility';
import * as React from 'react';
// @ts-ignore
import IconLike from '../icons/like.svg';
// @ts-ignore
import IconLikeFilled from '../icons/likeFilled.svg';

type Size = 'small' | 'normal';

type Props = {
  active?: boolean;
  count: number;
  // true: space-between, false: flex-start
  dense?: boolean;
  icon: string;
  // margin between icon and count. only works if 'dense' is true
  iconMargin?: number;
  onClick?: (any) => any;
  noBorder?: boolean;
  size?: Size;
};

const defaultProps = {
  active: false,
  dense: false,
  iconMargin: 4,
  noBorder: false,
  onClick: null,
  size: 'normal' as Size,
};

const StatusBadge: React.SFC<Props> = (props: Props) => {
  const { active, icon, count, size, noBorder, iconMargin, dense } = props;

  const isNormalSize = size === 'normal';

  const stylesSmallSize = {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 8,
      paddingLeft: 8,
      backgroundColor: 'white',
      opacity: 0.8,
      borderRadius: 4,
      alignItems: 'center',
      width: '100%',
    },
    icon: {
      display: 'block',
      height: 8,
      marginRight: iconMargin,
    },
  };

  const stylesNormalSize = {
    root: {
      alignItems: 'center',
      border: noBorder ? null : '1px solid gray',
      borderRadius: 8,
      display: 'flex',
      justifyContent: dense ? 'flex-start' : 'space-between',
      outline: 'unset', // TODO: improve a11y
      paddingBottom: 4,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 4,
    },
    icon: {
      display: 'block',
      height: 24,
      opacity: 0.8,
      width: 24,
      marginRight: iconMargin,
    },
  };

  let iconElement;
  switch (icon) {
    case 'like':
      iconElement = active ? (
        <IconLikeFilled
          fill="#3F51B5"
          style={isNormalSize ? stylesNormalSize.icon : stylesSmallSize.icon}
        />
      ) : (
        <IconLike
          style={isNormalSize ? stylesNormalSize.icon : stylesSmallSize.icon}
        />
      );
      break;
    case 'comment':
      iconElement = (
        <IconComment
          style={isNormalSize ? stylesNormalSize.icon : stylesSmallSize.icon}
        />
      );
      break;
    case 'view':
      iconElement = (
        <IconView
          style={isNormalSize ? stylesNormalSize.icon : stylesSmallSize.icon}
        />
      );
      break;
    default:
      iconElement = null;
  }

  const { onClick } = props;
  const isClickable = !!onClick;

  return (
    <div
      style={isNormalSize ? stylesNormalSize.root : stylesSmallSize.root}
      onClick={isClickable ? onClick : null}
      tabIndex={isClickable ? 0 : null}
      onKeyDown={e => isClickable && e.keyCode === 13 && onClick && onClick(e)}
      role="button"
    >
      {iconElement}
      <Typography variant={isNormalSize ? 'body1' : 'caption'}>
        {count}
      </Typography>
    </div>
  );
};

StatusBadge.defaultProps = defaultProps;

export default StatusBadge;
