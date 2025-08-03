import React, { useState } from 'react';
import { scroller } from 'react-scroll';
import { FaHome, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useUI } from '../../context/UIProvider';
import { config } from '../../config/appConfig';

const NavLink = ({ to, children, ...props }) => {
    const { onNavClick } = useUI();
    
    const handleClick = () => {
        onNavClick(); // Disable CSS snapping
        scroller.scrollTo(to, {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart',
            containerId: 'scroll-container'
        });
    };

    return (
        <button onClick={handleClick} {...props}>
            {children}
        </button>
    );
};


const FloatingNav = ({ sections }) => {
    const { activeColor } = useUI();
    const [isOpen, setIsOpen] = useState(true);

    const navGroups = sections.reduce((acc, section) => {
        if (section.type === 'group' && section.name !== 'Home') {
            acc[section.name] = {
                id: section.id,
                prefix: config.groupPrefixes[section.name] || section.name.charAt(0),
                color: config.colors[section.name]?.group,
                members: []
            };
        }
        return acc;
    }, {});

    sections.forEach(section => {
        if (section.type === 'member' && navGroups[section.group]) {
            navGroups[section.group].members.push({
                id: section.id,
                name: section.name,
                prefix: section.name === 'IU' ? config.memberPrefixes.IU : section.name.charAt(0),
                color: config.colors[section.group]?.[section.name],
            });
        }
    });

    return (
        <div className="fixed top-4 right-4 z-40 flex items-start gap-2">
            <div className={`flex flex-col items-end gap-2 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 -mr-32 pointer-events-none'}`}>
                <NavLink to="header" className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                    <FaHome/>
                </NavLink>

                {Object.values(navGroups).map(group => (
                     <div key={group.id} className="flex items-center justify-end gap-2">
                         {group.members.map(member => (
                             <NavLink key={member.id} to={member.id} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white cursor-pointer hover:scale-110 transition-transform" style={{backgroundColor: member.color}}>
                                 {member.prefix}
                             </NavLink>
                         ))}
                         <NavLink to={group.id} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white cursor-pointer hover:scale-110 transition-transform" style={{backgroundColor: group.color}}>
                             {group.prefix}
                         </NavLink>
                     </div>
                ))}
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ backgroundColor: activeColor, transition: 'background-color 0.5s ease' }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg"
            >
                {isOpen ? <FaAngleRight/> : <FaAngleLeft/>}
            </button>
        </div>
    );
};

export default FloatingNav;