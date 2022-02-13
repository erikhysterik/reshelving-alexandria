import React, {useRef} from "react"
import { connectSearchBox } from "react-instantsearch-dom"
import { Search as SearchIcon } from "@styled-icons/fa-solid"
import { Form } from "react-bootstrap"

export default connectSearchBox(
  ({ refine, currentRefinement, className, onFocus }) => {
   const inp = useRef(null);
   function iconClick() {
      inp.current.focus();
   }
   return (
    <>
    <Form className={className}>
        <Form.Control 
        type="text"
        className="SearchInput"
        placeholder="Search"
        aria-label="Search"
        onChange={e => refine(e.target.value)}
        value={currentRefinement}
        onFocus={onFocus}
        ref={inp}
        />
        <SearchIcon className="SearchIcon" onClick={iconClick} />
    </Form>
    </>
  )
   }
)