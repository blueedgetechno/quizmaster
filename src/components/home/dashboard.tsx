'use client'

import ActiveCards from './ActiveCards'
import HistoryTable from './HistoryTable'

export function Screen() {
  return (
    <div className='h-full px-2 py-8'>
      <ActiveCards />
      <div className='flex'>
        <HistoryTable />
        <div className=''></div>
      </div>
    </div>
  )
}

export default Screen
