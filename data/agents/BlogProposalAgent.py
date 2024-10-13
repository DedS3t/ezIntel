import os
import openai

openai.api_key = os.environ["OPENAI_API_KEY"]

class BlogProposalAgent:

    def analyze_news(self, tech_news, company_context):
        messages = [
            {"role": "system", "content": f"{company_context}. You are an expert in technical marketing and SEO content creation creating blogs for the following company and you'll be analyzing recent tech news and then analyzing possible keywords, topics, and blogs to create "},
            {"role": "user", "content": f"Specifically use this recent tech news: {tech_news}. Analyze it and provide an exhaustive list of relevant keywords, search intent, trending aspects of the news, and at least 10 quality blog creation possibilities."},
            {"role": "user", "content": "State the 10 quality blog creation topics/possibilities according to the topic of the recent tech news"},
            {"role": "user", "content": f"{company_context}. State the company name and Analyze how this news can connect to this specific following company context that you'll be creating the blog for. Specfiically include a short summary on how this company is relevant to this news"}
        ]


        response = openai.chat.completions.create(
            model="gpt-4o-mini",  
            messages=messages
        )

        analysis_results = response.choices[0].message.content
        return analysis_results
    
        
    
    def evaluate_blog_topics(self, analysis_results, company_context):
        messages = [
            {"role": "system", "content": "You are an assistant specialized in evaluating the quality and relevance of blog topics."},
            {"role": "user", "content": f"Evaluate the following list of blog topics. And justify and reason with each topic to see if it is worth writing on. Remove any irrelevant or low-quality topics. Write out your justification for each topic and be brutally honest.[IMPORTANT] If there are no suitable topics, please respond with 'No good blog topics to generate'. Only keep the ones that would be highly relevant to the following company context: {company_context}."},
            {"role": "user", "content": f"Blog Topics: {analysis_results}"},
        ]

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )

        filtered_topics = response.choices[0].message.content
        return filtered_topics
    
        
    def generate_blog(self, analysis_results, filtered_topics, company_context):
        messages = [
            {"role": "system", "content": "You are an expert blog writer focused on SEO optimization and technical content creation."},
            {"role": "user", "content": f"""
            Based on the following analysis results, filtered topics, and company context, pick ONE topic from the filtered topics and generate a well-crafted, concise blog outline with best practices. You're only allowed to use the blog topics from filtered topics.

            Analysis Results: {analysis_results}

            Recommended Blogs: {filtered_topics}

            Company Context: {company_context}

            Your task is to create engaging, informative, and persuasive content that highlights the unique features and benefits of computer vision integration in business. The blog must follow SEO best practices, with relevant keywords and a focus on how the company helps solve industry problems with computer vision. The blog should also follow this template:

            ```
            ---
            layout: post
            title: ""
            description: ""
            date: ""
            published: true
            tags:
            - 
            hero_image: "banner.png"
            read_time: "6 minutes"
            author:
            email: "sean@ezml.io"
            display_name: "Sean Dorje"
            first_name: "Sean"
            last_name: "Dorje"
            ---

            ## Engaging and Keyword-Rich Title

            First Paragraph:
            - A clear and attention-grabbing first paragraph that includes the keyword.
            - Brief summary of the blog.
            - Hook for the readers.

            Sub-headings:
            - Provide several informative sub-headings.
            
            Content:
            - Detailed content that explains the technical aspects in a simple, accessible manner.
            - Highlight the problem-solution fit of the company’s offering.
            - Showcase success stories or use cases demonstrating the company’s impact.
            
            Call to Action:
            - Encourage readers to schedule a meeting using this link: https://calendly.com/ezml/consultation
            ```
            """}
        ]

        # Call OpenAI API for blog generation
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # GPT-4 model for generating the blog
            messages=messages
        )

        # Extract the blog content
        blog_content = response.choices[0].message.content
        return blog_content

def run_agent_workflow(tech_news, company_context):
    blog_proposal_agent = BlogProposalAgent()

    print("\nBlog Proposal Agent is analyzing the news...")
    analysis_results = blog_proposal_agent.analyze_news(tech_news, company_context)
    
    # Print the result of the analyze_news step
    print("\nAnalysis Results:\n", analysis_results)
    
    # Blog Proposal Agent evaluates the blog topics based on the analysis results
    print("\nBlog Proposal Agent is evaluating the blog topics...")
    filtered_topics = blog_proposal_agent.evaluate_blog_topics(analysis_results, company_context)
    
    # Print the result of the evaluate_blog_topics step
    print("\nFiltered Blog Topics:\n", filtered_topics)
    
    # Blog Proposal Agent generates a blog outline based on the analysis and filtered topics
    if 'No good blog topics to generate' in filtered_topics:
        print("\nNo good blog topics to generate. Skipping blog generation.")
        return None 
    else:
        print("\nBlog Proposal Agent is generating the blog content...")
        blog_content = blog_proposal_agent.generate_blog(analysis_results, filtered_topics, company_context)
        print("\nGenerated Blog Content:\n", blog_content)
        
        return {'body': blog_content}
    
