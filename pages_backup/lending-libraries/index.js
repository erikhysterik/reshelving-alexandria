import React from "react";

import PageWrapper from "../../components/PageWrapper";
import Hero from "../../sections/common/Hero";
import Content from "../../sections/career/Content";
import Feature from "../../sections/career/Feature";
import States from "../../sections/lending-libraries/States";

const LendingLibraries = () => {
  return (
    <>
      <PageWrapper footerDark>
        <Hero title="Lending Libraries">
          This is a directory for the lending libraries. Pick a state!
        </Hero>
       {/* <Content />
        <Feature /> */}
        <States />
      </PageWrapper>
    </>
  );
};
export default LendingLibraries;
