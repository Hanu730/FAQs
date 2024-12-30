import * as React from 'react';
import styles from './Faq.module.scss';
import type { IFaqProps } from './IFaqProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

//import {  IconButton } from '@fluentui/react';//Stack, Text,DefaultButton
//import { mergeStyles } from '@fluentui/react/lib/Styling';

interface IFAQItem {
  question: string;
  answer: string;
}

interface IFAQState {
  expandedItem: number[]
  faqItems: IFAQItem[];
  isLoading: boolean;
  error: string | null;
}





export default class Faq extends React.Component<IFaqProps,IFAQState> {

 
 
  constructor(props:IFaqProps) {
    super(props);
    this.state = { expandedItem: [],
      faqItems: [],
      isLoading: true,
      error: null };
  }

  // toggleExpand = (index: number) => {
  //   const expandedItems = [...this.state.expandedItem]; // Copy the current state
  //   const itemIndex = expandedItems.indexOf(index); // Check if the item is already expanded
  
  //   if (itemIndex !== -1) {
  //     // If the item is already expanded, remove it
  //     expandedItems.splice(itemIndex, 1);
  //   } else {
  //     // If the item is not expanded, add it
  //     expandedItems.push(index);
  //   }
  
  //   this.setState({ expandedItem:expandedItems });
  // };

  toggleExpand(index:number) {

    const expandedItems = [...this.state.expandedItem];
    const itemIndex = expandedItems.indexOf(index);
    
    if (itemIndex === -1) {
      // If the item is not in the expanded list, add it
      expandedItems.push(index);
    } else {
      // If the item is in the expanded list, remove it
      expandedItems.splice(itemIndex, 1);
    }
  
    // Directly updating the state without the prevState callback
    this.setState({ expandedItem:expandedItems });
    
   
  }
  public render(): React.ReactElement<IFaqProps> {
    
    const { faqItems,isLoading,error} = this.state;
    
    console.log(this.state);
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className={styles.faqContainer}>
  <div className={styles.faqTitle}>
    {/* <span className={styles.faqTitleIcon}>💡</span> */}
    Frequently Asked Questions (FAQs)
  </div>
  {faqItems.map((item, index) => (
    <div key={index} className={styles.faqItem}>
      <div
        className={styles.faqQuestion}
        onClick={() => this.toggleExpand(index)}
        role="button"
        aria-expanded={this.state.expandedItem.indexOf(index) !== -1}
      >
        <span className={styles.questionText}>{item.question}</span>
        <span className={styles.iconButton}>
          {this.state.expandedItem.indexOf(index) !== -1 ? '-' : '+'}
        </span>
      </div>
      {this.state.expandedItem.indexOf(index) !== -1 && (
        <div className={styles.faqAnswer}>{item.answer}</div>
      )}
    </div>
  ))}
</div>

    //   <div className={styles.faqContainer}>
    //   <div className={styles.faqTitle}>
    //     <span className={styles.faqTitleIcon}>💡</span>
    //     Frequently Asked Questions (FAQs)
    //   </div>
    //   {faqItems.map((item, index) => (
    //     <div key={index} className={styles.faqItem}>
    //       <div
    //         className={styles.faqQuestion}
    //         onClick={() => this.toggleExpand(index)}
    //         role="button"
           
    //         aria-expanded={this.state.expandedItem.indexOf(index) !== -1}
    //       >
    //         {item.question}
    //         <span className={styles.iconButton}>
    //           {this.state.expandedItem.indexOf(index) !== -1 ? '+' : '-'}
    //         </span>
    //       </div>
    //       {this.state.expandedItem.indexOf(index) !== -1 && (
    //         <div className={styles.faqAnswer}>{item.answer}</div>
    //       )}
    //     </div>
    //   ))}
    // </div>

    //   <div className={styles.faqContainer}>
    //   <div className={styles.faqTitle}>Frequently Asked Questions</div>
    //   {faqItems.map((item, index) => (
    //     <div key={index} className={styles.faqItem}>
    //       <div
    //         className={styles.faqQuestion}
    //         onClick={() => this.toggleExpand(index)}
    //         role="button"
    //         aria-expanded={expandedItem === index}
    //       >
    //         <span>{item.question}</span>
    //         <IconButton
    //           iconProps={{
    //             iconName: expandedItem === index ? 'ChevronUp' : 'ChevronDown',
    //           }}
    //         />
    //       </div>
    //       {expandedItem === index && (
    //         <div className={styles.faqAnswer}>{item.answer}</div>
    //       )}
    //     </div>
    //   ))}
    //   {/* <DefaultButton text="Contact Support" className={styles.contactButton} /> */}
    // </div>
    );
  }

  componentDidMount() {
    this.fetchFAQItems();
  }

  fetchFAQItems = async () => {
    sp.setup({
      spfxContext:this.context,
      sp: {
         baseUrl: "https://websyn.sharepoint.com/sites/Websyn-Intranet-UAT", // Replace with your site URL
      },
    })
    try {
      const items = await sp.web.lists.getByTitle("FAQs").items.select("Title", "Answer").get();
      const faqItems = items.map((item: any) => ({
        question: item.Title,
        answer: item.Answer,
      }));
      this.setState({ faqItems:faqItems,isLoading: false });
    } catch (error) {
      this.setState({
        isLoading: false,
        error: error.message,
      });
      console.error("Error fetching FAQ items: ", error);
    }
  };
}
