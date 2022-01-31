import React from "react";
import Pagination from '../Pagination'
import { PageItem, PagePrev, PageFirst, PageNext, PageLast, PageEllipsis } from "../Pagination/Pagination";

export default function CustomPagination(props) {
    const [pageArray, setPageArray] = React.useState([]);
  
    React.useEffect(() => {
      var totPages = parseInt(props.totPages);
      var currentPage = parseInt(props.currentPage);
      var pageArr = [];
      if (totPages > 1) {
        if (totPages <= 9) {
          var i = 1;
          while (i <= totPages) {
            pageArr.push(i);
            i++;
          }
        } else {
          if (currentPage <= 5) pageArr = [1, 2, 3, 4, 5, 6, 7, 8, "", totPages];
          else if (totPages - currentPage <= 4)
            pageArr = [
              1,
              "",
              totPages - 7,
              totPages - 6,
              totPages - 5,
              totPages - 4,
              totPages - 3,
              totPages - 2,
              totPages - 1,
              totPages
            ];
          else
            pageArr = [
              1,
              "",
              currentPage - 3,
              currentPage - 2,
              currentPage - 1,
              currentPage,
              currentPage + 1,
              currentPage + 2,
              currentPage + 3,
              "",
              totPages
            ];
        }
      }
      setPageArray(pageArr);
    }, []);
  
    return (
      <>
        {props.children}
        <div style={{ marginTop: "15px" }}>
          <Pagination style={{ justifyContent: "center" }}>
            {pageArray.map((ele, ind) => {
              const toReturn = [];
  
              if (ind === 0) {
                toReturn.push(
                  <PageFirst
                    key={"firstpage"}
                    onClick={
                      props.currentPage === 1
                        ? () => {}
                        : () => {
                            props.pageClicked(1);
                          }
                    }
                  />
                );
  
                toReturn.push(
                  <PagePrev
                    key={"prevpage"}
                    onClick={
                      props.currentPage === 1
                        ? () => {}
                        : () => {
                            props.pageClicked(props.currentPage - 1);
                          }
                    }
                  />
                );
              }
  
              if (ele === "") toReturn.push(<PageEllipsis key={ind} />);
              else
                toReturn.push(
                  <PageItem
                    key={ind}
                    active={props.currentPage === ele ? true : false}
                    onClick={
                      props.currentPage === ele
                        ? () => {}
                        : () => {
                            props.pageClicked(ele);
                          }
                    }
                  >
                    {ele}
                  </PageItem>
                );
  
              if (ind === pageArray.length - 1) {
                toReturn.push(
                  <PageNext
                    key={"nextpage"}
                    onClick={
                      props.currentPage === ele
                        ? () => {}
                        : () => {
                            props.pageClicked(props.currentPage + 1);
                          }
                    }
                  />
                );
  
                toReturn.push(
                  <PageLast
                    key={"lastpage"}
                    onClick={
                      props.currentPage === ele
                        ? () => {}
                        : () => {
                            props.pageClicked(ele);
                          }
                    }
                  />
                );
              }
  
              return toReturn;
            })}
          </Pagination> 
        </div>
      </>
    );
  }
  
