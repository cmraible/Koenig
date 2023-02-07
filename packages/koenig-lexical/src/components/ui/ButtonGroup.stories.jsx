import React from 'react';
import {ButtonGroup, IconButton} from './ButtonGroup';
import {ReactComponent as ImageRegularIcon} from '../../assets/icons/kg-img-regular.svg';
import {ReactComponent as ImageWideIcon} from '../../assets/icons/kg-img-wide.svg';
import {ReactComponent as ImageFullIcon} from '../../assets/icons/kg-img-full.svg';

const story = {
    title: 'Generic/Button group',
    component: ButtonGroup,
    subcomponents: {IconButton},
    parameters: {
        status: {
            type: 'uiReady'
        }
    }
};
export default story;

const Template = (args) => {
    return (
        <ButtonGroup {...args} />
    );
};

export const CardWidth = Template.bind({});
CardWidth.args = {
    selectedName: 'regular',
    children: [
        <IconButton name='regular' Icon={ImageRegularIcon} {...IconButton.args} />,
        <IconButton name='wide' Icon={ImageWideIcon} {...IconButton.args} />,
        <IconButton name='full' Icon={ImageFullIcon} {...IconButton.args} />
    ]
};