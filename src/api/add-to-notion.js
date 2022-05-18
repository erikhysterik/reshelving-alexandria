export default function handler(req, res) {
    
    res.status(200).json({ hello: `world` })

    
    // map req inputs to table column names
    //let cols = {
    //    Title: {/*type title*/ },
    //    "Page Count (est.)": {/*type number*/},
    //    "Book Description": {/*type text*/},
    //    "Content Considerations": {/*type text, filter NAs*/},
    //    "Pub. Yr/Decade": {/*type multiselect*/},
    //    Tags: {/*subject tags, type multiselect*/}
    //};
/*
    const options = {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Notion-Version': '2022-02-22',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NOTION_KEY}`,
          body: JSON.stringify(
            {
                //   ACTUALLY I THINK THIS IS NOT NEEDED IF NOT CHANGING DB NAME!!!!
               // title: [
               //     {
               //         text: {
               //             content: process.env.NOTION_DB_NAME
               //         }
               //     }
               // ],
                properties: cols
            }
          )
        }
      };
      
      fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DB_ID}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
        */
}