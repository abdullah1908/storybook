import React, { Children, Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import Placeholder from '../placeholder/placeholder';
import { FlexBar } from '../bar/bar';
import { TabButton } from '../bar/button';

const Wrapper = styled.div(
  ({ theme, bordered }) =>
    bordered
      ? {
          background: theme.mainFill,
          backgroundClip: 'padding-box',
          borderRadius: theme.mainBorderRadius,
          border: theme.mainBorder,
        }
      : {},
  ({ absolute }) =>
    absolute
      ? {
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }
      : {
          display: 'block',
        }
);

export const TabBar = styled.div(
  {
    whiteSpace: 'nowrap',
    height: '100%',

    '&:first-child': {
      marginLeft: 0,
    },
  },
  ({ scroll }) => ({
    // super lame, hiding of scrollbar
    paddingBottom: 50,
    overflowX: scroll ? 'auto' : 'visisble',
    overflowY: scroll ? 'hidden' : 'visisble',
  }),
  ({ flex }) =>
    flex
      ? {
          flex: typeof flex === 'number' ? flex : 1,
        }
      : {}
);

const Content = styled.div(
  {
    display: 'block',
    position: 'relative',
  },
  ({ absolute }) =>
    absolute
      ? {
          position: 'relative',
          overflow: 'auto',
          flex: 1,
          width: '100%',
        }
      : {}
);

const VisuallyHidden = styled.div(({ active }) =>
  active ? { display: 'block' } : { display: 'none' }
);
export const TabWrapper = ({ active, render, children }) => (
  <VisuallyHidden active={active}>{render ? render() : children}</VisuallyHidden>
);
TabWrapper.propTypes = {
  active: PropTypes.bool.isRequired,
  render: PropTypes.func,
  children: PropTypes.node,
};
TabWrapper.defaultProps = {
  render: undefined,
  children: undefined,
};

export const panelProps = {
  active: PropTypes.bool,
};

const childrenToList = (children, selected) =>
  Children.toArray(children).map(({ props: { title, id, children: childrenOfChild } }, index) => {
    const content = Array.isArray(childrenOfChild) ? childrenOfChild[0] : childrenOfChild;
    return {
      active: selected ? id === selected : index === 0,
      title,
      id,
      render:
        typeof content === 'function'
          ? content
          : // eslint-disable-next-line react/prop-types
            ({ active, key }) => (
              <VisuallyHidden key={key} active={active} role="tabpanel">
                {content}
              </VisuallyHidden>
            ),
    };
  });

export const Tabs = React.memo(
  ({ children, selected, actions, absolute, bordered, scroll, tools, id: htmlId }) => {
    const list = childrenToList(children, selected);

    return list.length ? (
      <Wrapper absolute={absolute} bordered={bordered} id={htmlId}>
        <FlexBar border scroll={!scroll}>
          <TabBar role="tablist">
            {list.map(({ title, id, active }) => (
              <TabButton
                type="button"
                key={id}
                active={active}
                onClick={e => e.preventDefault() || actions.onSelect(id)}
                role="tab"
              >
                {typeof title === 'function' ? title() : title}
              </TabButton>
            ))}
          </TabBar>
          {tools ? <Fragment>{tools}</Fragment> : null}
        </FlexBar>
        <Content absolute={absolute}>
          {list.map(({ id, active, render }) => render({ key: id, active }))}
        </Content>
      </Wrapper>
    ) : (
      <Placeholder>no panels available</Placeholder>
    );
  }
);
Tabs.displayName = 'Tabs';
Tabs.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  tools: PropTypes.node,
  selected: PropTypes.string,
  actions: PropTypes.shape({
    onSelect: PropTypes.func.isRequired,
  }).isRequired,
  absolute: PropTypes.bool,
  bordered: PropTypes.bool,
  scroll: PropTypes.bool,
};
Tabs.defaultProps = {
  id: null,
  children: null,
  tools: null,
  selected: null,
  absolute: false,
  bordered: false,
  scroll: true,
};

// eslint-disable-next-line react/no-multi-comp
export class TabsState extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.node, PropTypes.func])),
    initial: PropTypes.string,
    absolute: PropTypes.bool,
    bordered: PropTypes.bool,
    scroll: PropTypes.bool,
  };

  static defaultProps = {
    children: [],
    initial: null,
    absolute: false,
    bordered: false,
    scroll: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.initial,
    };
  }

  render() {
    const { bordered = false, absolute = false, children, scroll = true } = this.props;
    const { selected } = this.state;
    return (
      <Tabs
        bordered={bordered}
        absolute={absolute}
        selected={selected}
        scroll={scroll}
        actions={{
          onSelect: id => this.setState({ selected: id }),
        }}
      >
        {children}
      </Tabs>
    );
  }
}
