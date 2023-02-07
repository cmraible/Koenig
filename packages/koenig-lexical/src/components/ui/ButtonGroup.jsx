import React from 'react';

import PropTypes from 'prop-types';

export function ButtonGroup({children, selectedName, onClick}) {
    return (
        <div className="flex">
            <ul className="flex items-center justify-evenly rounded bg-grey-100 font-sans text-md font-normal text-white">
                {children.map(({label, name, Icon}) => (<IconButton
                    onClick={onClick}
                    label={label}
                    name={name}
                    selectedName={selectedName}
                    Icon={Icon}
                />))}
            </ul>
        </div>
    );
}

export function IconButton({onClick, label, name, selectedName, Icon}) {
    const isActive = name === selectedName;
    return (
        <li>
            <button
                type="button"
                className={`flex h-7 w-8 items-center justify-center ${isActive ? 'rounded bg-white shadow-sm' : '' } m-1`}
                onClick={() => onClick(name)}
                aria-label={label}
            >
                <Icon />
            </button>
        </li>
    );
}

ButtonGroup.propTypes = {
    selectedName: PropTypes.oneOf(['regular', 'wide', 'full'])
};