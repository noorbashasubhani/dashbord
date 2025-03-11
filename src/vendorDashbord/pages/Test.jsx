import React from 'react'
import { UserContext } from '../../../UserContext';
import { useContext } from 'react';

export const Test = () => {
  const userdatas = useContext(UserContext);
  return (
    <div>
        <marquee><p style={{ backgroundColor: "blue", color: "white",width:"100%" }}>{userdatas.name}</p></marquee>
    </div>
  )
}
