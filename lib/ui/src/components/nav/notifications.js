import { styled } from '@storybook/theming';
import { Link } from '@storybook/router';

const levelStyle = ({ level, theme }) => {
  switch (level) {
    case 0: {
      return {
        background: theme.color.negative,
      };
    }
    case 1: {
      return {
        background: theme.color.danger,
      };
    }
    default: {
      return {
        background: theme.color.secondary,
      };
    }
  }
};

const baseStyle = {
  padding: '5px 10px',
  display: 'flex',
  margin: 10,
  alignItems: 'center',
  justifyContent: 'center',
  height: 48,
  borderRadius: 10,
  backgroundColor: 'rgba(50, 53, 71, 0.97)',
  boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
  color: 'white',
  textDecoration: 'none',
  userSelect: 'none',
};

export const NotificationLink = styled(Link)(levelStyle, baseStyle);
export const Notification = styled.div(levelStyle, baseStyle);

export const NotificationText = styled.span({ flex: 1 });
export const NotificationIcon = styled.span({ width: 20 });

export const NotificationSpacer = styled.div({
  height: 60,
});

export const Notifications = styled.div({
  position: 'absolute',
  display: 'block',
  bottom: 0,
  margin: 0,
  padding: 0,
  width: '100%',
  zIndex: 2,
});
