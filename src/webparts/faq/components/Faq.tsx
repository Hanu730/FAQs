import * as React from 'react';
import styles from './Faq.module.scss';
import type { IFaqProps } from './IFaqProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import {  IconButton } from '@fluentui/react';//Stack, Text,DefaultButton
//import { mergeStyles } from '@fluentui/react/lib/Styling';

interface IFAQItem {
  question: string;
  answer: string;
}

interface IFAQState {
  expandedItem: number|null
  faqItems: IFAQItem[];
  isLoading: boolean;
  error: string | null;
}





export default class Faq extends React.Component<IFaqProps,IFAQState> {

 
 
  constructor(props:IFaqProps) {
    super(props);
    this.state = { expandedItem: null,
      faqItems: [],
      isLoading: true,
      error: null };
  }

  toggleExpand = (index: number) => {
    this.setState({ expandedItem: this.state.expandedItem === index ? null : index });
  };
  public render(): React.ReactElement<IFaqProps> {
    
    const { faqItems,isLoading,error,expandedItem} = this.state;
    console.log(this.state);
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className={styles.faqContainer}>
      <div className={styles.faqTitle}>Frequently Asked Questions</div>
      {faqItems.map((item, index) => (
        <div key={index} className={styles.faqItem}>
          <div
            className={styles.faqQuestion}
            onClick={() => this.toggleExpand(index)}
            role="button"
            aria-expanded={expandedItem === index}
          >
            <span>{item.question}</span>
            <IconButton
              iconProps={{
                iconName: expandedItem === index ? 'ChevronUp' : 'ChevronDown',
              }}
            />
          </div>
          {expandedItem === index && (
            <div className={styles.faqAnswer}>{item.answer}</div>
          )}
        </div>
      ))}
      {/* <DefaultButton text="Contact Support" className={styles.contactButton} /> */}
    </div>
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
