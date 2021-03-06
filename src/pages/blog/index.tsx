/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-danger */
import Link from "next/link";
import Head from "next/head";

import { MainContainer, Container, MainContent } from "../../styles/Blog";

import MidCta from "../../components/MidCta";
import Navbar from "../../components/Navbar";
import { getBlogPosts } from "../../network/notion";

export async function getStaticProps() {
  const posts = await getBlogPosts();

  return {
    props: {
      posts,
    },
    revalidate: 120, // In seconds
  };
}

const BlogPage = ({ posts }) => (
  <>
    <Head>
      <title>Blog - Teste de Leitura</title>
      <meta
        name="description"
        content="Tudo sobre melhores práticas de escrita, teste de leitura e como escrever bons textos."
      />
    </Head>
    <MainContainer>
      <MainContent>
        <Navbar />
        <Container>
          <h1>Blog</h1>
          <div className="postList">
            {posts.map((post) => (
              <div key={post.slug}>
                <h3>
                  <Link href={`/blog/${post.slug}`}>
                    <a>{post.title}</a>
                  </Link>
                </h3>
                <p>{post.description}</p>
              </div>
            ))}
          </div>
          <MidCta />
        </Container>
      </MainContent>
    </MainContainer>
  </>
);

export default BlogPage;
