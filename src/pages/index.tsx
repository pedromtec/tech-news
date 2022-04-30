import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

type HomeProps = {
  product: {
    priceId: string;
    formattedAmount: string;
  };
};

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Tech news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.formattedAmount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const PRICE_ID = "price_1KO7fJJIiuVyFNgm3VAKpUsg";

  const price = await stripe.prices.retrieve(PRICE_ID);
  const product = {
    priceId: price.id,
    formattedAmount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
