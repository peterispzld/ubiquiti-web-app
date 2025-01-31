import { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import IconButton from './IconButton'
import { AppContext } from '../App'
import { Device } from '../types/api'
import closeIcon from '../assets/close_icon.svg'
import { headerHeight, toolbarHeight } from '../constants'

const serialize = (selectedIds: string[]) => selectedIds.join(',')

const deserialize = (serializedString: string) => serializedString.split(',')

const StyledButton = styled.button`
  color: rgb(0, 0, 0, 0.45);
  border: none;
  background-color: white;
`

interface DropdownMenuProps {
  $isOpen: boolean
}

const DropdownMenu = styled.ul<DropdownMenuProps>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  right: 0;
  top: ${headerHeight};
  list-style-type: none;
  padding: 0;
  background-color: white;
  min-width: 256px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);
  z-index: 1;
`

const DropdownMenuItem = styled.li`
  display: flex;
  align-items: center;
  color: black;
  padding: 4px 16px;
  color: rgb(0, 0, 0, 0.65);
  cursor: pointer;

  &:hover {
    background-color: rgb(251, 251, 251);
  }
`

const ScrollableSection = styled.div`
  height: 400px;
  overflow-y: scroll;
`

const StyledCheckbox = styled.input`
  margin-right: 8px;
  width: 16px;
  height: 16px;

  accent-color: rgb(0, 111, 255);
`

const CloseFilter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${toolbarHeight};
  padding: 0px 14px;
  border-bottom: 1px solid rgb(237, 237, 240);
`

const FilterName = styled.div`
  padding: 20px 14px;
`

const uniqueLines = (devices: Device[]) => {
  return devices.reduce((acc: Device[], device) => {
    const found = acc.find((item) => item.line.id === device.line.id)
    if (!found) {
      acc.push(device)
    }

    return acc
  }, [])
}

export default function SelectFilter() {
  const { deviceList } = useContext(AppContext)

  const productLines = uniqueLines(deviceList)

  const dropdownRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const [searchParams, setSearchParams] = useSearchParams({
    lines: [],
  })

  const checkedItems = searchParams.get('lines') || ''

  const toggleDropdown = () => setIsOpen(!isOpen)
  return (
    <>
      <StyledButton onClick={toggleDropdown}>Filter</StyledButton>
      <DropdownMenu ref={dropdownRef} $isOpen={isOpen}>
        <CloseFilter>
          <span style={{ color: 'rgb(0, 0, 0, 0.65)' }}>Filter</span>
          <IconButton icon={closeIcon} handleOnClick={toggleDropdown} />
        </CloseFilter>
        <ScrollableSection>
          <FilterName>
            <strong>Product line</strong>
          </FilterName>
          {productLines.map((device) => (
            <DropdownMenuItem
              key={device.id}
              onClick={() => {
                setSearchParams((prev) => {
                  const prevLines = deserialize(prev.get('lines') || '')
                  prevLines.includes(device.line.id)
                    ? prev.set(
                        'lines',
                        serialize(
                          prevLines.filter((item) => item !== device.line.id),
                        ),
                      )
                    : prev.set(
                        'lines',
                        serialize([...prevLines, device.line.id]),
                      )
                  return prev
                })
              }}
            >
              <StyledCheckbox
                type="checkbox"
                checked={checkedItems.includes(device.line.id)}
                onChange={() => {}}
              />
              {device.line.name}
            </DropdownMenuItem>
          ))}
        </ScrollableSection>
      </DropdownMenu>
    </>
  )
}
