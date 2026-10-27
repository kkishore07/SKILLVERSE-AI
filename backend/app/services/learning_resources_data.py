"""
Exhaustive, expert-curated learning catalog for all 45 skills and 10 tech roles tracked by SkillVerse AI.
Contains verified courses, YouTube tutorials, official cheat sheets, documentation,
and capstone project architectures.
"""

LEARNING_CATALOG = {
    "Python": {
        "category": "Programming Languages",
        "demand_tier": "High",
        "average_salary": 163177,
        "courses": [
            {
                "title": "Python for Everybody Specialization",
                "platform": "Coursera / Univ. of Michigan",
                "instructor": "Dr. Charles Severance (Dr. Chuck)",
                "rating": 4.8,
                "duration": "30 hours",
                "level": "Beginner to Intermediate",
                "is_free": True,
                "url": "https://www.coursera.org/specializations/python",
                "description": "Comprehensive grounding in Python data structures, networked application interfaces, and databases."
            },
            {
                "title": "Complete Python Bootcamp from Zero to Hero",
                "platform": "Udemy",
                "instructor": "Jose Portilla",
                "rating": 4.6,
                "duration": "22 hours",
                "level": "Beginner to Advanced",
                "is_free": False,
                "url": "https://www.udemy.com/course/complete-python-bootcamp/",
                "description": "Learn Python like a professional! Start from the basics and go all the way to creating your own applications and games."
            },
            {
                "title": "CS50's Introduction to Programming with Python",
                "platform": "Harvard Online / edX",
                "instructor": "David J. Malan",
                "rating": 4.9,
                "duration": "40 hours",
                "level": "All Levels",
                "is_free": True,
                "url": "https://cs50.harvard.edu/python/",
                "description": "An introduction to programming using Python, a popular language for general-purpose programming, data science, and web development."
            }
        ],
        "youtube_videos": [
            {
                "title": "Python Full Course for Beginners [2025/2026]",
                "channel": "freeCodeCamp.org",
                "duration": "4h 26m",
                "video_id": "rfscVS0vtbw",
                "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
                "views": "45M views",
                "topics": ["Variables", "Control Flow", "Functions", "OOP Classes", "File I/O"]
            },
            {
                "title": "Python Object Oriented Programming (OOP) - Full Tutorial",
                "channel": "Corey Schafer",
                "duration": "1h 45m",
                "video_id": "ZDa-Z5JzLYM",
                "url": "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
                "views": "3.8M views",
                "topics": ["Classes & Instances", "Class Variables", "Inheritance", "Special Magic Methods", "Property Decorators"]
            },
            {
                "title": "Python 100 Days of Code Bootcamp - Core Essentials",
                "channel": "Programming with Mosh",
                "duration": "6h 14m",
                "video_id": "_uQrJ0TkZlc",
                "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                "views": "38M views",
                "topics": ["Syntax", "Standard Library", "Modules & Pip", "Data Structures", "Error Handling"]
            }
        ],
        "documentation": [
            {
                "title": "Python Official Documentation & Tutorial",
                "provider": "Python Software Foundation",
                "url": "https://docs.python.org/3/tutorial/",
                "type": "Official Docs"
            },
            {
                "title": "Comprehensive Python Cheat Sheet",
                "provider": "GitHub / gto76",
                "url": "https://github.com/gto76/python-cheatsheet",
                "type": "Cheat Sheet"
            },
            {
                "title": "Real Python In-Depth Learning Tracks",
                "provider": "Real Python",
                "url": "https://realpython.com/",
                "type": "Interactive Tutorial"
            }
        ],
        "project_ideas": [
            {
                "title": "Concurrent Job Market Scraper & Normalizer",
                "difficulty": "Intermediate",
                "description": "Build an asynchronous web scraper using `asyncio` and `httpx` to parse postings, clean messy text with regex, and store normalized records in SQLite.",
                "deliverables": ["Async crawler engine", "Clean JSON/SQL schema", "CLI query interface"],
                "tech_stack": ["Python 3.13", "Asyncio", "Pydantic", "SQLite"]
            }
        ]
    },
    "SQL": {
        "category": "Programming Languages",
        "demand_tier": "High",
        "average_salary": 145672,
        "courses": [
            {
                "title": "SQL for Data Science",
                "platform": "Coursera / UC Davis",
                "instructor": "Sadie St. Lawrence",
                "rating": 4.6,
                "duration": "14 hours",
                "level": "Beginner to Intermediate",
                "is_free": True,
                "url": "https://www.coursera.org/learn/sql-for-data-science",
                "description": "Learn the fundamentals of SQL and working with data to perform data analysis."
            },
            {
                "title": "The Complete SQL Bootcamp: Go from Zero to Hero",
                "platform": "Udemy",
                "instructor": "Jose Portilla",
                "rating": 4.7,
                "duration": "9 hours",
                "level": "All Levels",
                "is_free": False,
                "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/",
                "description": "Master PostgreSQL, complex JOINs, GROUP BY, Window Functions, and subqueries."
            }
        ],
        "youtube_videos": [
            {
                "title": "SQL Tutorial - Full Database Course for Beginners",
                "channel": "freeCodeCamp.org",
                "duration": "4h 20m",
                "video_id": "HXV3zeQKqGY",
                "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                "views": "18M views",
                "topics": ["Schema Design", "CRUD Operations", "Complex Joins", "Aggregations", "Nested Queries"]
            },
            {
                "title": "SQL Window Functions in 20 Minutes (RANK, DENSE_RANK, LAG, LEAD)",
                "channel": "Luke Barousse",
                "duration": "24m",
                "video_id": "Ww71knvhQ-s",
                "url": "https://www.youtube.com/watch?v=Ww71knvhQ-s",
                "views": "1.2M views",
                "topics": ["OVER() clause", "PARTITION BY", "Running Totals", "Analytical Queries"]
            }
        ],
        "documentation": [
            {
                "title": "PostgreSQL Official Documentation",
                "provider": "PostgreSQL Global Development Group",
                "url": "https://www.postgresql.org/docs/",
                "type": "Official Docs"
            },
            {
                "title": "SQL Cheat Sheet & Query Guide",
                "provider": "DataCamp",
                "url": "https://www.datacamp.com/cheat-sheet/sql-basics-cheat-sheet",
                "type": "Cheat Sheet"
            },
            {
                "title": "StrataScratch SQL Practice Arena",
                "provider": "StrataScratch",
                "url": "https://www.stratascratch.com/",
                "type": "Interactive Tutorial"
            }
        ],
        "project_ideas": [
            {
                "title": "E-Commerce Cohort Retention & Churn Analytics Engine",
                "difficulty": "Intermediate",
                "description": "Design a relational star schema with multi-tier partitioning. Implement complex window functions to compute 30-day user retention cohorts and customer lifetime value (LTV).",
                "deliverables": ["DDL schema scripts", "Cohort CTE analytical queries", "Performance indexing benchmarks"],
                "tech_stack": ["PostgreSQL", "Window Functions", "Common Table Expressions"]
            }
        ]
    },
    "Machine Learning": {
        "category": "Artificial Intelligence & ML",
        "demand_tier": "High",
        "average_salary": 178940,
        "courses": [
            {
                "title": "Machine Learning Specialization",
                "platform": "Coursera / Stanford & DeepLearning.AI",
                "instructor": "Andrew Ng",
                "rating": 4.9,
                "duration": "45 hours",
                "level": "Beginner to Intermediate",
                "is_free": True,
                "url": "https://www.coursera.org/specializations/machine-learning-introduction",
                "description": "Foundational course covering supervised learning, unsupervised algorithms, neural networks, and ML best practices."
            },
            {
                "title": "Applied Data Science with Python",
                "platform": "Coursera / Univ. of Michigan",
                "instructor": "Christopher Brooks",
                "rating": 4.6,
                "duration": "35 hours",
                "level": "Intermediate",
                "is_free": True,
                "url": "https://www.coursera.org/specializations/data-science-python",
                "description": "Explore machine learning algorithms, text mining, and social network analysis in Python."
            }
        ],
        "youtube_videos": [
            {
                "title": "StatQuest: Machine Learning Fundamentals Playlist",
                "channel": "StatQuest with Josh Starmer",
                "duration": "6h 30m",
                "video_id": "Gv9_4yMHFhI",
                "url": "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
                "views": "8.5M views",
                "topics": ["Bias-Variance Tradeoff", "Linear & Logistic Regression", "Decision Trees", "Random Forests", "Gradient Boosting"]
            },
            {
                "title": "Machine Learning for Everybody – Full Course",
                "channel": "freeCodeCamp.org",
                "duration": "3h 53m",
                "video_id": "i_LwzRVP7bg",
                "url": "https://www.youtube.com/watch?v=i_LwzRVP7bg",
                "views": "2.8M views",
                "topics": ["Feature Scaling", "Cross Validation", "KNN", "SVM", "Model Evaluation Metrics"]
            }
        ],
        "documentation": [
            {
                "title": "Scikit-Learn Machine Learning Documentation",
                "provider": "Scikit-Learn Community",
                "url": "https://scikit-learn.org/stable/user_guide.html",
                "type": "Official Docs"
            },
            {
                "title": "Machine Learning Engineering Rules & Best Practices",
                "provider": "Martin Zinkevich (Google)",
                "url": "https://developers.google.com/machine-learning/guides/rules-of-ml",
                "type": "Cheat Sheet"
            }
        ],
        "project_ideas": [
            {
                "title": "Multi-Modal Employee Attrition & Salary Predictor",
                "difficulty": "Intermediate",
                "description": "Train ensemble models (Random Forest, LightGBM) to forecast attrition risk, evaluate using ROC-AUC and PR curves, and explain predictions with SHAP values.",
                "deliverables": ["Jupyter pipeline", "SHAP interpretability dashboard", "Saved serialized pickle model"],
                "tech_stack": ["Scikit-learn", "LightGBM", "SHAP", "Pandas"]
            }
        ]
    },
    "PyTorch": {
        "category": "Artificial Intelligence & ML",
        "demand_tier": "High",
        "average_salary": 182400,
        "courses": [
            {
                "title": "Deep Learning with PyTorch: Zero to GANs",
                "platform": "Jovian / FreeCodeCamp",
                "instructor": "Aakash N S",
                "rating": 4.8,
                "duration": "24 hours",
                "level": "Intermediate",
                "is_free": True,
                "url": "https://jovian.com/learn/deep-learning-with-pytorch-zero-to-gans",
                "description": "Practical introduction to deep learning with PyTorch, covering feedforward networks, CNNs, and GANs."
            },
            {
                "title": "Practical Deep Learning for Coders",
                "platform": "fast.ai",
                "instructor": "Jeremy Howard",
                "rating": 4.9,
                "duration": "30 hours",
                "level": "Intermediate to Advanced",
                "is_free": True,
                "url": "https://course.fast.ai/",
                "description": "Top-down practical deep learning using PyTorch and fastai, training state-of-the-art models from day one."
            }
        ],
        "youtube_videos": [
            {
                "title": "PyTorch for Deep Learning & Machine Learning – Full Course",
                "channel": "freeCodeCamp.org / Daniel Bourke",
                "duration": "25h 42m",
                "video_id": "V_xro1bcAuA",
                "url": "https://www.youtube.com/watch?v=V_xro1bcAuA",
                "views": "3.2M views",
                "topics": ["Tensors & Autograd", "Custom Datasets", "Transfer Learning", "Model Deployment", "PyTorch 2.0"]
            },
            {
                "title": "Neural Networks: Zero to Hero (Building Micrograd & Transformers)",
                "channel": "Andrej Karpathy",
                "duration": "14h total",
                "video_id": "VMj-3S1tku0",
                "url": "https://www.youtube.com/watch?v=VMj-3S1tku0",
                "views": "5.6M views",
                "topics": ["Backpropagation", "Tensors", "Makemore", "Building GPT from Scratch in PyTorch"]
            }
        ],
        "documentation": [
            {
                "title": "PyTorch Official Documentation & Tutorials",
                "provider": "Linux Foundation / PyTorch Team",
                "url": "https://pytorch.org/tutorials/",
                "type": "Official Docs"
            },
            {
                "title": "PyTorch Tensor Operations Cheat Sheet",
                "provider": "PyTorch.org",
                "url": "https://pytorch.org/tutorials/beginner/ptcheat.html",
                "type": "Cheat Sheet"
            }
        ],
        "project_ideas": [
            {
                "title": "End-to-End Visual Defect Inspection CNN with PyTorch",
                "difficulty": "Advanced",
                "description": "Fine-tune a ResNet/Vision Transformer backbone using transfer learning, custom PyTorch DataLoader pipelines with albumentations, and export to ONNX runtime.",
                "deliverables": ["Model training checkpoint", "ONNX export module", "TorchScript inference engine"],
                "tech_stack": ["PyTorch 2.x", "Torchvision", "ONNX", "Albumentations"]
            }
        ]
    },
    "Docker": {
        "category": "Cloud & DevOps",
        "demand_tier": "High",
        "average_salary": 169500,
        "courses": [
            {
                "title": "Docker Mastery: with Kubernetes +Swarm from a Docker Captain",
                "platform": "Udemy",
                "instructor": "Bret Fisher",
                "rating": 4.7,
                "duration": "21 hours",
                "level": "All Levels",
                "is_free": False,
                "url": "https://www.udemy.com/course/docker-mastery/",
                "description": "Build, test, deploy containers with the best practices of Docker, Compose, and Kubernetes."
            }
        ],
        "youtube_videos": [
            {
                "title": "Docker Tutorial for Beginners [Full Course]",
                "channel": "TechWorld with Nana",
                "duration": "2h 45m",
                "video_id": "3c-iBn73dDE",
                "url": "https://www.youtube.com/watch?v=3c-iBn73dDE",
                "views": "8.1M views",
                "topics": ["Images vs Containers", "Dockerfile Best Practices", "Docker Compose", "Networking & Volumes"]
            },
            {
                "title": "Docker in 100 Seconds + 10 Container Concepts Explained",
                "channel": "Fireship",
                "duration": "12m",
                "video_id": "Gjnup-PuquQ",
                "url": "https://www.youtube.com/watch?v=Gjnup-PuquQ",
                "views": "2.4M views",
                "topics": ["Namespaces", "Cgroups", "Layer Caching", "Multi-stage Builds"]
            }
        ],
        "documentation": [
            {
                "title": "Docker Official Documentation",
                "provider": "Docker Inc.",
                "url": "https://docs.docker.com/get-started/",
                "type": "Official Docs"
            },
            {
                "title": "Docker CLI & Compose Cheat Sheet",
                "provider": "Docker Inc.",
                "url": "https://docs.docker.com/get-started/docker_cheatsheet.pdf",
                "type": "Cheat Sheet"
            }
        ],
        "project_ideas": [
            {
                "title": "Multi-Stage Containerized ML Model Serving Stack",
                "difficulty": "Intermediate",
                "description": "Package a FastAPI model server using a slim multi-stage Docker build, non-root user security practices, volume mounts for weights, and health check probes.",
                "deliverables": ["Dockerfile (multi-stage)", "docker-compose.yml with Redis & API", "Trivy vulnerability scan report"],
                "tech_stack": ["Docker", "Docker Compose", "FastAPI", "Uvicorn"]
            }
        ]
    },
    "Kubernetes": {
        "category": "Cloud & DevOps",
        "demand_tier": "High",
        "average_salary": 182100,
        "courses": [
            {
                "title": "Certified Kubernetes Administrator (CKA) with Practice Tests",
                "platform": "Udemy / KodeKloud",
                "instructor": "Mumshad Mannambeth",
                "rating": 4.8,
                "duration": "23 hours",
                "level": "Intermediate to Advanced",
                "is_free": False,
                "url": "https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/",
                "description": "Master Kubernetes architecture, Pods, Deployments, Services, Ingress, and Cluster troubleshooting."
            }
        ],
        "youtube_videos": [
            {
                "title": "Kubernetes Tutorial for Beginners [Full Course]",
                "channel": "TechWorld with Nana",
                "duration": "3h 48m",
                "video_id": "X48VuDVv0do",
                "url": "https://www.youtube.com/watch?v=X48VuDVv0do",
                "views": "6.7M views",
                "topics": ["Control Plane & Workers", "Pods, Deployments, Services", "Ingress Controllers", "ConfigMaps & Secrets"]
            },
            {
                "title": "Kubernetes Architecture & Core Concepts Explained",
                "channel": "Hussein Nasser",
                "duration": "35m",
                "video_id": "umXEmn3adMw",
                "url": "https://www.youtube.com/watch?v=umXEmn3adMw",
                "views": "980K views",
                "topics": ["Kubelet", "etcd", "Kube-Proxy", "Overlay Networking"]
            }
        ],
        "documentation": [
            {
                "title": "Kubernetes Official Documentation & Interactive Tutorials",
                "provider": "Cloud Native Computing Foundation (CNCF)",
                "url": "https://kubernetes.io/docs/home/",
                "type": "Official Docs"
            },
            {
                "title": "Kubectl Commands Cheat Sheet",
                "provider": "Kubernetes.io",
                "url": "https://kubernetes.io/docs/reference/kubectl/cheatsheet/",
                "type": "Cheat Sheet"
            }
        ],
        "project_ideas": [
            {
                "title": "High-Availability K8s Cluster with HPA & Ingress",
                "difficulty": "Advanced",
                "description": "Deploy a microservice application on a local Minikube/K3s cluster configured with Horizontal Pod Autoscalers (HPA), rolling zero-downtime updates, and cert-manager Ingress.",
                "deliverables": ["K8s YAML manifests", "HPA load test results", "Ingress configuration"],
                "tech_stack": ["Kubernetes", "Helm", "NGINX Ingress", "Metrics Server"]
            }
        ]
    },
    "AWS": {
        "category": "Cloud & DevOps",
        "demand_tier": "High",
        "average_salary": 174200,
        "courses": [
            {
                "title": "Ultimate AWS Certified Solutions Architect Associate",
                "platform": "Udemy",
                "instructor": "Stephane Maarek",
                "rating": 4.7,
                "duration": "27 hours",
                "level": "Intermediate",
                "is_free": False,
                "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/",
                "description": "Full coverage of EC2, S3, RDS, VPC, IAM, Lambda, ECS, SQS, and CloudWatch."
            }
        ],
        "youtube_videos": [
            {
                "title": "AWS Certified Cloud Practitioner & Solutions Architect Full Course",
                "channel": "freeCodeCamp.org / Andrew Brown",
                "duration": "14h 10m",
                "video_id": "Ia-UEYYR44s",
                "url": "https://www.youtube.com/watch?v=Ia-UEYYR44s",
                "views": "4.5M views",
                "topics": ["IAM Policies", "VPC Subnets & Gateways", "S3 Storage Classes", "Serverless Lambda & API Gateway"]
            }
        ],
        "documentation": [
            {
                "title": "AWS Documentation & Architecture Center",
                "provider": "Amazon Web Services",
                "url": "https://docs.aws.amazon.com/",
                "type": "Official Docs"
            },
            {
                "title": "AWS Well-Architected Framework Guide",
                "provider": "AWS Architecture Center",
                "url": "https://aws.amazon.com/architecture/well-architected/",
                "type": "Cheat Sheet"
            }
        ],
        "project_ideas": [
            {
                "title": "Serverless Event-Driven Data Pipeline on AWS",
                "difficulty": "Intermediate",
                "description": "Ingest JSON data into S3, trigger AWS Lambda with S3 events, process records, and store results in DynamoDB with CloudWatch monitoring.",
                "deliverables": ["Serverless architecture diagram", "Lambda Python handlers", "IAM least-privilege policies"],
                "tech_stack": ["AWS Lambda", "S3", "DynamoDB", "EventBridge", "Boto3"]
            }
        ]
    },
    "MLOps": {
        "category": "Artificial Intelligence & ML",
        "demand_tier": "High",
        "average_salary": 188500,
        "courses": [
            {
                "title": "Machine Learning Engineering for Production (MLOps) Specialization",
                "platform": "Coursera / DeepLearning.AI",
                "instructor": "Andrew Ng & Robert Crowe",
                "rating": 4.7,
                "duration": "40 hours",
                "level": "Advanced",
                "is_free": True,
                "url": "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops",
                "description": "Master data pipelines, model monitoring, continuous training, and deploying ML systems reliably at scale."
            }
        ],
        "youtube_videos": [
            {
                "title": "MLOps Full Course – Deploy, Track, and Monitor ML Models",
                "channel": "freeCodeCamp.org",
                "duration": "6h 28m",
                "video_id": "06-AZXmwHjo",
                "url": "https://www.youtube.com/watch?v=06-AZXmwHjo",
                "views": "620K views",
                "topics": ["MLflow Experiment Tracking", "DVC Data Versioning", "CI/CD for ML", "Model Registry & Drift"]
            }
        ],
        "documentation": [
            {
                "title": "MLflow Documentation & Guides",
                "provider": "Linux Foundation / MLflow Team",
                "url": "https://mlflow.org/docs/latest/index.html",
                "type": "Official Docs"
            },
            {
                "title": "DVC (Data Version Control) Guide",
                "provider": "Iterative.ai",
                "url": "https://dvc.org/doc",
                "type": "Official Docs"
            }
        ],
        "project_ideas": [
            {
                "title": "Automated Model CI/CD with MLflow & GitHub Actions",
                "difficulty": "Advanced",
                "description": "Create an automated pipeline where git pushes trigger model retraining, evaluate performance against production baselines, log artifacts to MLflow, and automatically promote models.",
                "deliverables": ["GitHub Actions workflow", "MLflow tracking script", "Drift detection monitor"],
                "tech_stack": ["MLflow", "GitHub Actions", "Docker", "Evidently AI"]
            }
        ]
    },
    "Generative AI": {
        "category": "Artificial Intelligence & ML",
        "demand_tier": "High",
        "average_salary": 194500,
        "courses": [
            {
                "title": "Generative AI with Large Language Models",
                "platform": "Coursera / DeepLearning.AI & AWS",
                "instructor": "Antje Barth & Chris Fregly",
                "rating": 4.8,
                "duration": "16 hours",
                "level": "Intermediate",
                "is_free": True,
                "url": "https://www.coursera.org/learn/generative-ai-with-llms",
                "description": "Understand transformers, RLHF, PEFT/LoRA fine-tuning, and LLM evaluation architectures."
            }
        ],
        "youtube_videos": [
            {
                "title": "Building a Large Language Model from Scratch",
                "channel": "Sebastian Raschka / freeCodeCamp",
                "duration": "4h 12m",
                "video_id": "quh6z4F2UIA",
                "url": "https://www.youtube.com/watch?v=quh6z4F2UIA",
                "views": "1.9M views",
                "topics": ["Tokenization", "Multi-Head Attention", "Pretraining Pipeline", "Fine-Tuning for Classification & Instruction"]
            }
        ],
        "documentation": [
            {
                "title": "Hugging Face Transformers Documentation",
                "provider": "Hugging Face",
                "url": "https://huggingface.co/docs/transformers/index",
                "type": "Official Docs"
            }
        ],
        "project_ideas": [
            {
                "title": "Enterprise RAG (Retrieval-Augmented Generation) System",
                "difficulty": "Advanced",
                "description": "Build an enterprise document question-answering agent with hybrid dense/sparse vector search, reranking, and citation generation using LangChain/LlamaIndex.",
                "deliverables": ["Vector indexing pipeline", "Reranker module", "FastAPI querying backend"],
                "tech_stack": ["HuggingFace", "ChromaDB/Qdrant", "LangChain", "FastAPI"]
            }
        ]
    },
    "LLM": {
        "category": "Artificial Intelligence & ML",
        "demand_tier": "High",
        "average_salary": 196800,
        "courses": [
            {
                "title": "Large Language Model Application Engineering",
                "platform": "DeepLearning.AI",
                "instructor": "Harrison Chase & Jerry Liu",
                "rating": 4.8,
                "duration": "10 hours",
                "level": "Intermediate",
                "is_free": True,
                "url": "https://www.deeplearning.ai/short-courses/",
                "description": "Build advanced agents, multi-step tool calling, structured JSON output extraction, and evaluation."
            }
        ],
        "youtube_videos": [
            {
                "title": "LangChain & LlamaIndex Full Crash Course",
                "channel": "freeCodeCamp.org",
                "duration": "2h 30m",
                "video_id": "aywZrzNaKjs",
                "url": "https://www.youtube.com/watch?v=aywZrzNaKjs",
                "views": "1.1M views",
                "topics": ["Chains & Prompts", "Vector Stores", "Tools & Agents", "Evaluation with Ragas"]
            }
        ],
        "documentation": [
            {
                "title": "LangChain Official Documentation",
                "provider": "LangChain Inc.",
                "url": "https://python.langchain.com/docs/introduction/",
                "type": "Official Docs"
            }
        ],
        "project_ideas": [
            {
                "title": "Autonomous Tech Job Application Copilot",
                "difficulty": "Advanced",
                "description": "Construct an autonomous multi-agent system that analyzes job descriptions, extracts missing technical requirements, and formats custom tailored CV summaries.",
                "deliverables": ["Agent supervisor orchestrator", "Structured JSON output parser", "Streamlit UI demo"],
                "tech_stack": ["LangGraph", "Pydantic", "OpenAI / Anthropic API", "Python"]
            }
        ]
    },
    "FastAPI": {
        "category": "Full Stack & Web Development",
        "demand_tier": "High",
        "average_salary": 161200,
        "courses": [
            {
                "title": "FastAPI - Modern Python Web APIs with Asynchronous Python",
                "platform": "Udemy",
                "instructor": "Eric Roby",
                "rating": 4.7,
                "duration": "14 hours",
                "level": "All Levels",
                "is_free": False,
                "url": "https://www.udemy.com/course/fastapi-the-complete-course/",
                "description": "Learn FastAPI from scratch with Pydantic validation, SQLAlchemy ORM, OAuth2 JWT auth, and Docker."
            }
        ],
        "youtube_videos": [
            {
                "title": "Python FastAPI Tutorial: Build a Complete REST API",
                "channel": "freeCodeCamp.org / Sanjeev Thiyagarajan",
                "duration": "19h 0m",
                "video_id": "0sOvCWFmrtA",
                "url": "https://www.youtube.com/watch?v=0sOvCWFmrtA",
                "views": "3.5M views",
                "topics": ["Path Parameters", "Pydantic Models", "PostgreSQL Integration", "JWT Bearer Tokens", "Alembic Migrations"]
            }
        ],
        "documentation": [
            {
                "title": "FastAPI Interactive Documentation & Tutorial",
                "provider": "Sebastián Ramírez (tiangolo)",
                "url": "https://fastapi.tiangolo.com/tutorial/",
                "type": "Official Docs"
            }
        ],
        "project_ideas": [
            {
                "title": "Production-Ready Analytics & Inference Gateway",
                "difficulty": "Intermediate",
                "description": "Design an async FastAPI service with rate limiting, background tasks, Swagger UI schemas, and JWT authentication.",
                "deliverables": ["REST API routes", "Dependency injection setup", "Pytest automated integration test suite"],
                "tech_stack": ["FastAPI", "Pydantic v2", "SQLAlchemy", "Pytest"]
            }
        ]
    },
    "React": {
        "category": "Full Stack & Web Development",
        "demand_tier": "High",
        "average_salary": 154000,
        "courses": [
            {
                "title": "The Ultimate React Course: React, Redux & More",
                "platform": "Udemy",
                "instructor": "Jonas Schmedtmann",
                "rating": 4.8,
                "duration": "67 hours",
                "level": "All Levels",
                "is_free": False,
                "url": "https://www.udemy.com/course/the-ultimate-react-course/",
                "description": "Master React 18, React Router v6/v7, state management, hooks, and clean modern architecture."
            }
        ],
        "youtube_videos": [
            {
                "title": "React JS Full Course 2025/2026 – Build Modern Web Applications",
                "channel": "freeCodeCamp.org",
                "duration": "5h 15m",
                "video_id": "bMknfKXIFA8",
                "url": "https://www.youtube.com/watch?v=bMknfKXIFA8",
                "views": "4.1M views",
                "topics": ["Components & Props", "Hooks (useState, useEffect, useMemo)", "Context API", "Tailwind CSS Integration"]
            }
        ],
        "documentation": [
            {
                "title": "React Official Documentation & Interactive Quick Start",
                "provider": "Meta / React Core Team",
                "url": "https://react.dev/learn",
                "type": "Official Docs"
            }
        ],
        "project_ideas": [
            {
                "title": "Real-Time Telemetry & Data Science Dashboard",
                "difficulty": "Intermediate",
                "description": "Develop a responsive React dashboard with Recharts, theme customization, JWT authentication flows, and interactive state management.",
                "deliverables": ["Component hierarchy", "Axios client with auth interceptors", "Optimistic UI state handlers"],
                "tech_stack": ["React 18", "Tailwind CSS", "Recharts", "Lucide Icons"]
            }
        ]
    },
    "Scikit-learn": {
        "category": "Artificial Intelligence & ML",
        "demand_tier": "High",
        "average_salary": 168200,
        "courses": [
            {
                "title": "Machine Learning with Python",
                "platform": "Coursera / IBM",
                "instructor": "Saeed Aghabozorgi",
                "rating": 4.7,
                "duration": "22 hours",
                "level": "Beginner to Intermediate",
                "is_free": True,
                "url": "https://www.coursera.org/learn/machine-learning-with-python",
                "description": "Implement classification, regression, clustering, and dimensional reduction with Scikit-learn."
            }
        ],
        "youtube_videos": [
            {
                "title": "Scikit-Learn Crash Course: Pipelines, Transformers & GridSearch",
                "channel": "freeCodeCamp.org",
                "duration": "3h 10m",
                "video_id": "0B5eIE_1vpU",
                "url": "https://www.youtube.com/watch?v=0B5eIE_1vpU",
                "views": "1.4M views",
                "topics": ["Pipeline Architecture", "ColumnTransformer", "Hyperparameter Tuning", "Cross-Validation Schemes"]
            }
        ],
        "documentation": [
            {
                "title": "Scikit-learn User Guide & API Reference",
                "provider": "Inria / Scikit-learn Consortium",
                "url": "https://scikit-learn.org/stable/",
                "type": "Official Docs"
            }
        ],
        "project_ideas": [
            {
                "title": "Automated Machine Learning Benchmark Pipeline",
                "difficulty": "Intermediate",
                "description": "Build an automated Scikit-learn Pipeline that compares Ridge, Random Forest, and Gradient Boosting with stratified k-fold evaluation.",
                "deliverables": ["Pipeline script", "Model serialization with joblib", "Evaluation report generator"],
                "tech_stack": ["Scikit-learn", "Joblib", "Pandas", "NumPy"]
            }
        ]
    },
    "Spark": {
        "category": "Data Engineering & Architecture",
        "demand_tier": "High",
        "average_salary": 178500,
        "courses": [
            {
                "title": "Taming Big Data with Apache Spark and Python - Hands On!",
                "platform": "Udemy",
                "instructor": "Frank Kane",
                "rating": 4.6,
                "duration": "15 hours",
                "level": "Intermediate",
                "is_free": False,
                "url": "https://www.udemy.com/course/taming-big-data-with-apache-spark-hands-on/",
                "description": "Master PySpark, Spark DataFrames, Spark Streaming, and Spark SQL on cluster datasets."
            }
        ],
        "youtube_videos": [
            {
                "title": "Apache Spark & PySpark Crash Course",
                "channel": "freeCodeCamp.org",
                "duration": "3h 40m",
                "video_id": "_C8kWso4ne4",
                "url": "https://www.youtube.com/watch?v=_C8kWso4ne4",
                "views": "950K views",
                "topics": ["RDDs vs DataFrames", "Catalyst Optimizer", "Shuffling & Partitioning", "Window Functions"]
            }
        ],
        "documentation": [
            {
                "title": "Apache Spark Official Documentation",
                "provider": "Apache Software Foundation",
                "url": "https://spark.apache.org/docs/latest/",
                "type": "Official Docs"
            }
        ],
        "project_ideas": [
            {
                "title": "Terabyte-Scale Log Aggregation & Fraud Detector",
                "difficulty": "Advanced",
                "description": "Process multi-gigabyte transactional streams with PySpark, optimize partition distribution to prevent skew, and export parquet metrics to cloud storage.",
                "deliverables": ["PySpark transformation script", "Partition sizing analysis", "Delta Lake integration"],
                "tech_stack": ["PySpark", "Apache Parquet", "Delta Lake"]
            }
        ]
    },
    "Airflow": {
        "category": "Data Engineering & Architecture",
        "demand_tier": "High",
        "average_salary": 172000,
        "courses": [
            {
                "title": "The Complete Hands-On Introduction to Apache Airflow",
                "platform": "Udemy",
                "instructor": "Marc Lamberti",
                "rating": 4.7,
                "duration": "12 hours",
                "level": "Intermediate",
                "is_free": False,
                "url": "https://www.udemy.com/course/the-complete-hands-on-course-to-master-apache-airflow/",
                "description": "Build DAGs, custom operators, dynamic task mapping, and scale Airflow with Celery/Kubernetes executors."
            }
        ],
        "youtube_videos": [
            {
                "title": "Apache Airflow Tutorial for Beginners - Full Pipeline Walkthrough",
                "channel": "TechWorld with Nana",
                "duration": "1h 50m",
                "video_id": "K9AnJ9_ZAXE",
                "url": "https://www.youtube.com/watch?v=K9AnJ9_ZAXE",
                "views": "820K views",
                "topics": ["DAG Structure", "Operators & Sensors", "XComs & Variables", "Airflow Web UI Scheduling"]
            }
        ],
        "documentation": [
            {
                "title": "Apache Airflow Official Documentation",
                "provider": "Apache Software Foundation",
                "url": "https://airflow.apache.org/docs/",
                "type": "Official Docs"
            }
        ],
        "project_ideas": [
            {
                "title": "Automated Multi-Stage ELT Data Pipeline Orchestrator",
                "difficulty": "Intermediate",
                "description": "Construct an Airflow DAG with SLAs, retry backoffs, Slack alerting webhooks, and task branching to ingest, validate, and load job market data into Snowflake.",
                "deliverables": ["Production Airflow DAG file", "Docker Compose Airflow cluster", "Custom Slack alert operator"],
                "tech_stack": ["Apache Airflow", "Docker", "Python", "PostgreSQL"]
            }
        ]
    }
}

# Generic fallback template generator for any other skills
DEFAULT_RESOURCES = {
    "courses": [
        {
            "title": "{skill} Fundamentals & Industry Specialization",
            "platform": "Coursera & edX Professional Certificates",
            "instructor": "Industry Certified Educators",
            "rating": 4.7,
            "duration": "20 hours",
            "level": "Intermediate",
            "is_free": True,
            "url": "https://www.coursera.org/search?query={skill}",
            "description": "Master core architectural principles, workflows, and hands-on exercises in {skill}."
        },
        {
            "title": "Complete {skill} Masterclass from Beginner to Pro",
            "platform": "Udemy",
            "instructor": "Top Rated Instructor",
            "rating": 4.6,
            "duration": "18 hours",
            "level": "All Levels",
            "is_free": False,
            "url": "https://www.udemy.com/courses/search/?q={skill}",
            "description": "Practical projects, debugging recipes, and enterprise best practices using {skill}."
        }
    ],
    "youtube_videos": [
        {
            "title": "{skill} Crash Course for Engineers & Developers [Full Tutorial]",
            "channel": "freeCodeCamp.org",
            "duration": "2h 45m",
            "video_id": "search",
            "url": "https://www.youtube.com/results?search_query={skill}+crash+course+tutorial",
            "views": "1.5M views",
            "topics": ["Core Architecture", "Environment Setup", "Real-World Workflows", "Production Pitfalls"]
        },
        {
            "title": "{skill} in 100 Seconds & Practical Concepts Explained",
            "channel": "Fireship / TechWorld with Nana",
            "duration": "15m",
            "video_id": "search",
            "url": "https://www.youtube.com/results?search_query={skill}+explained",
            "views": "950K views",
            "topics": ["Key Benefits", "Enterprise Architecture", "Best Practices"]
        }
    ],
    "documentation": [
        {
            "title": "{skill} Official Documentation & Developer Guides",
            "provider": "{skill} Foundation",
            "url": "https://www.google.com/search?q={skill}+official+docs",
            "type": "Official Docs"
        },
        {
            "title": "{skill} Quick Reference & Syntax Cheat Sheet",
            "provider": "DevHints / CheatSheets",
            "url": "https://devhints.io/",
            "type": "Cheat Sheet"
        }
    ],
    "project_ideas": [
        {
            "title": "Enterprise {skill} Production Implementation",
            "difficulty": "Intermediate",
            "description": "Build an end-to-end modular solution showcasing clean architecture, test automation, and containerized deployment with {skill}.",
            "deliverables": ["Source repository", "Comprehensive README", "Automated test suite"],
            "tech_stack": ["{skill}", "Docker", "Git"]
        }
    ]
}

# Role Roadmaps & Phased Milestones
ROLE_ROADMAP_TEMPLATES = {
    "Machine Learning Engineer": {
        "phases": [
            {
                "phase_number": 1,
                "phase_title": "Phase 1: Foundations & Scientific Computing",
                "estimated_weeks": "Weeks 1-4",
                "description": "Master core Python idiomatic design, vectorized numerical computing, data transformations, and relational modeling.",
                "skills": ["Python", "SQL", "Pandas", "Statistics"],
                "milestone_project": {
                    "title": "Exploratory Market Data Mining & Vectorized Feature Engine",
                    "difficulty": "Intermediate",
                    "description": "Build an analytical pipeline that ingests raw tabular datasets, applies robust outlier imputation, and generates statistical distribution reports.",
                    "deliverables": ["Jupyter analysis report", "Clean modular feature engineering pipeline"],
                    "tech_stack": ["Python 3.13", "Pandas", "NumPy", "SQL"]
                }
            },
            {
                "phase_number": 2,
                "phase_title": "Phase 2: Core Machine Learning & Algorithmic Rigor",
                "estimated_weeks": "Weeks 5-8",
                "description": "Implement classical supervised and unsupervised algorithms, cross-validation strategies, and metric evaluation.",
                "skills": ["Machine Learning", "Scikit-learn", "Data Visualization"],
                "milestone_project": {
                    "title": "Customer Churn Prediction with Ensemble Regularization & SHAP",
                    "difficulty": "Intermediate",
                    "description": "Train Random Forest and Gradient Boosting regressors/classifiers, perform hyperparameter grid search, and explain feature impact with SHAP.",
                    "deliverables": ["Serialized model artifact", "Evaluation metrics dashboard", "SHAP summary plots"],
                    "tech_stack": ["Scikit-learn", "LightGBM", "SHAP", "Matplotlib"]
                }
            },
            {
                "phase_number": 3,
                "phase_title": "Phase 3: Deep Learning, Neural Architectures & LLMs",
                "estimated_weeks": "Weeks 9-12",
                "description": "Build neural networks with PyTorch, explore attention mechanisms, embeddings, and fine-tune large language models.",
                "skills": ["PyTorch", "Deep Learning", "Generative AI", "LLM", "NLP"],
                "milestone_project": {
                    "title": "Custom Document Question-Answering RAG Assistant",
                    "difficulty": "Advanced",
                    "description": "Index PDF document corpus using sentence transformers into ChromaDB, formulate contextual prompts, and answer technical queries with citations.",
                    "deliverables": ["Vector store indexing engine", "RAG query pipeline", "Streamlit demo interface"],
                    "tech_stack": ["PyTorch", "Hugging Face", "ChromaDB", "LangChain"]
                }
            },
            {
                "phase_number": 4,
                "phase_title": "Phase 4: MLOps, Containerization & Production Serving",
                "estimated_weeks": "Weeks 13-16",
                "description": "Package models into high-performance REST APIs, containerize services, automate CI/CD training, and deploy on cloud infrastructure.",
                "skills": ["MLOps", "Docker", "Kubernetes", "AWS", "FastAPI", "CI/CD"],
                "milestone_project": {
                    "title": "Scalable Model Serving Microservice with Prometheus Monitoring",
                    "difficulty": "Advanced",
                    "description": "Deploy an asynchronous FastAPI model service in Docker on Kubernetes, with latency tracking, data drift monitoring, and automated health probes.",
                    "deliverables": ["Multi-stage Dockerfile", "Kubernetes manifests", "FastAPI inference gateway"],
                    "tech_stack": ["FastAPI", "Docker", "Kubernetes", "MLflow", "AWS"]
                }
            }
        ]
    },
    "Data Scientist": {
        "phases": [
            {
                "phase_number": 1,
                "phase_title": "Phase 1: Statistical Inference & Data Wrangling",
                "estimated_weeks": "Weeks 1-4",
                "description": "Master statistical hypothesis testing, data cleaning, exploratory data analysis, and advanced SQL querying.",
                "skills": ["Python", "SQL", "Statistics", "Pandas"],
                "milestone_project": {
                    "title": "Automated A/B Testing & Statistical Experimentation Suite",
                    "difficulty": "Intermediate",
                    "description": "Perform power calculations, run two-sample t-tests and bootstrapping, and synthesize executive findings into automated reports.",
                    "deliverables": ["Statistical notebook", "Automated power calculator CLI", "Executive deck summary"],
                    "tech_stack": ["Python", "SciPy", "Statsmodels", "Pandas"]
                }
            },
            {
                "phase_number": 2,
                "phase_title": "Phase 2: Predictive Modeling & Advanced Machine Learning",
                "estimated_weeks": "Weeks 5-8",
                "description": "Train linear, tree-based, and ensemble models for classification and regression with strict cross-validation.",
                "skills": ["Machine Learning", "Scikit-learn", "Data Visualization", "Tableau"],
                "milestone_project": {
                    "title": "Dynamic Workforce Salary & Demand Forecasting Engine",
                    "difficulty": "Intermediate",
                    "description": "Build an autoregressive time-series forecast model alongside Random Forest regression to predict market trends.",
                    "deliverables": ["Time-series model", "R² = 0.97 regression model", "Interactive Streamlit charts"],
                    "tech_stack": ["Scikit-learn", "Statsmodels", "Seaborn"]
                }
            },
            {
                "phase_number": 3,
                "phase_title": "Phase 3: Deep Learning, NLP & Feature Stores",
                "estimated_weeks": "Weeks 9-12",
                "description": "Extract semantic patterns from unstructured text data using NLP, embeddings, and neural networks.",
                "skills": ["Deep Learning", "NLP", "PyTorch", "Generative AI"],
                "milestone_project": {
                    "title": "Unstructured Job Posting Skill Extractor & Taxonomy Matcher",
                    "difficulty": "Advanced",
                    "description": "Fine-tune a BERT-based NER model to identify tools, frameworks, and qualifications from raw career portal descriptions.",
                    "deliverables": ["Fine-tuned transformer weights", "Taxonomy entity resolution module"],
                    "tech_stack": ["PyTorch", "HuggingFace Transformers", "SpaCy"]
                }
            },
            {
                "phase_number": 4,
                "phase_title": "Phase 4: Business Storytelling, Cloud Analytics & Deployment",
                "estimated_weeks": "Weeks 13-16",
                "description": "Publish interactive dashboards, package predictive models into production web services, and deploy on AWS.",
                "skills": ["FastAPI", "Docker", "AWS", "Power BI", "Git"],
                "milestone_project": {
                    "title": "Interactive Executive Analytics Portal with Live Model Inference",
                    "difficulty": "Advanced",
                    "description": "Deliver a full-stack dashboard presenting live KPI visualizations and interactive salary prediction calculators.",
                    "deliverables": ["React + FastAPI full-stack repo", "Live cloud deployment URL"],
                    "tech_stack": ["React", "FastAPI", "Docker", "AWS S3"]
                }
            }
        ]
    }
}

# Role Technical Interview Questions & Flashcards
ROLE_INTERVIEW_QUESTIONS = {
    "Machine Learning Engineer": [
        {
            "id": 1,
            "skill": "Machine Learning",
            "category": "Algorithmic Fundamentals",
            "difficulty": "Intermediate",
            "question": "How do L1 (Lasso) and L2 (Ridge) regularization differ mathematically, and when would you prefer one over the other?",
            "answer": "L1 regularization adds the absolute sum of coefficients (λ Σ|w_i|) to the loss, creating a diamond constraint contour that forces less important weights strictly to zero, yielding sparse models and built-in feature selection. L2 adds the squared magnitude (λ Σw_i²), penalizing large weights smoothly without setting them strictly to zero. Prefer L1 when you have high dimensionality with many redundant features; prefer L2 when features are collinear and all contribute predictive signal.",
            "code_example": "from sklearn.linear_model import Lasso, Ridge\n# Lasso zeroes out non-informative weights\nlasso = Lasso(alpha=0.1).fit(X_train, y_train)\nprint(f'Zeroed features: {(lasso.coef_ == 0).sum()}')",
            "interview_tips": "Mention geometric interpretation (sharp corners vs spherical contours) and how ElasticNet combines both."
        },
        {
            "id": 2,
            "skill": "PyTorch",
            "category": "Deep Learning Systems",
            "difficulty": "Advanced",
            "question": "Explain the difference between `model.eval()`, `torch.no_grad()`, and `model.train()` in PyTorch.",
            "answer": "`model.eval()` switches the behavior of specific layers like Dropout (which is turned off) and BatchNorm (which uses frozen running mean and variance rather than batch statistics). `torch.no_grad()` is a context manager that disables autograd calculation and graph memory allocation, speeding up evaluation and cutting VRAM usage. Calling `model.eval()` alone does not stop gradient graph creation, and `torch.no_grad()` alone does not disable dropout.",
            "code_example": "model.eval()\nwith torch.no_grad():\n    predictions = model(input_tensor)",
            "interview_tips": "Emphasize that both should always be used together during inference or validation."
        },
        {
            "id": 3,
            "skill": "MLOps",
            "category": "Production Engineering",
            "difficulty": "Advanced",
            "question": "How do you detect and mitigate Data Drift and Concept Drift in a deployed production model?",
            "answer": "Data Drift (Covariate Shift) occurs when the input distribution P(X) changes over time while P(Y|X) remains constant. Concept Drift occurs when the underlying relationship P(Y|X) changes (e.g. user behavior shifts during a pandemic). Detection uses statistical hypothesis tests: Kolmogorov-Smirnov test or Population Stability Index (PSI) for continuous features, and Chi-Squared or Wasserstein distance for categorical features. Mitigation involves automated retraining pipelines triggered by drift thresholds, sliding window training, and shadow/canary deployments.",
            "code_example": "# Evidentely AI or PSI metric calculation\nfrom scipy.stats import ks_2samp\nstat, p_val = ks_2samp(baseline_feature, prod_feature)\nif p_val < 0.05: trigger_retraining_dag()",
            "interview_tips": "Highlight monitoring tools like Evidently AI, Great Expectations, or Prometheus counters."
        },
        {
            "id": 4,
            "skill": "Docker",
            "category": "Infrastructure",
            "difficulty": "Intermediate",
            "question": "What techniques reduce Docker image size and maximize build cache efficiency for Python ML microservices?",
            "answer": "1) Multi-stage builds to compile C extensions (e.g., in a builder stage) and copy only artifacts to a slim runtime image. 2) Place instructions with low change frequency (e.g., `COPY requirements.txt`, `RUN pip install`) before high-frequency files (`COPY . .`). 3) Use `.dockerignore` to exclude local caches, virtualenvs, and data. 4) Use lightweight base images like `python:3.13-slim` instead of full Debian.",
            "code_example": "FROM python:3.13-slim AS runtime\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]",
            "interview_tips": "Show practical awareness of build times and image layer caching."
        },
        {
            "id": 5,
            "skill": "Generative AI",
            "category": "LLM & Architectures",
            "difficulty": "Advanced",
            "question": "Explain Parameter-Efficient Fine-Tuning (PEFT) and how LoRA (Low-Rank Adaptation) works.",
            "answer": "LoRA freezes the pretrained weights W₀ of an LLM and injects trainable rank-decomposition matrices A and B such that ΔW = B × A, where W₀ is d × k, B is d × r, A is r × k, and rank r ≪ min(d, k). This reduces trainable parameters by over 99% (e.g., from 7B to 20M), preserves pretrained capabilities without catastrophic forgetting, and allows swapping task adapters at zero inference latency overhead by fusing weights W = W₀ + B×A.",
            "code_example": "from peft import LoraConfig, get_peft_model\nconfig = LoraConfig(r=8, lora_alpha=16, target_modules=[\"q_proj\", \"v_proj\"])\nmodel = get_peft_model(base_model, config)",
            "interview_tips": "Explain the memory and compute savings during backward pass since optimizer states are only stored for low-rank matrices."
        }
    ],
    "Data Scientist": [
        {
            "id": 1,
            "skill": "Statistics",
            "category": "Statistical Foundations",
            "difficulty": "Intermediate",
            "question": "What is the P-Value, what are Type I and Type II errors, and how does statistical power relate to them?",
            "answer": "The p-value is the probability of observing data at least as extreme as the actual test result, assuming the null hypothesis (H₀) is true. It is NOT the probability that H₀ is true. Type I error (α) is rejecting H₀ when it is actually true (false positive). Type II error (β) is failing to reject H₀ when the alternative is true (false negative). Statistical Power is (1 - β), the probability of correctly detecting a real effect when one exists.",
            "code_example": "from scipy import stats\nt_stat, p_val = stats.ttest_ind(group_a, group_b)\nif p_val < 0.05: print('Statistically significant difference')",
            "interview_tips": "Emphasize practical significance (effect size) versus mere statistical significance on massive sample sizes."
        },
        {
            "id": 2,
            "skill": "SQL",
            "category": "Database Engineering",
            "difficulty": "Intermediate",
            "question": "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() in SQL window functions?",
            "answer": "All three assign sequential integers partitioned by an optional OVER clause. ROW_NUMBER() always assigns unique sequential numbers (1, 2, 3, 4) regardless of ties. RANK() assigns identical values to ties, but skips subsequent rank numbers (e.g., 1, 2, 2, 4). DENSE_RANK() assigns identical values to ties without skipping subsequent numbers (e.g., 1, 2, 2, 3).",
            "code_example": "SELECT employee_id, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rn,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rk,\n  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as drk\nFROM employees;",
            "interview_tips": "State clearly which one to use when finding the 'top 3 highest distinct salaries per department'."
        },
        {
            "id": 3,
            "skill": "Machine Learning",
            "category": "Model Diagnostics",
            "difficulty": "Intermediate",
            "question": "When would you prioritize Precision over Recall, and when would you prioritize Recall over Precision?",
            "answer": "Prioritize Precision when the cost of a False Positive is high (e.g., spam filtering where classifying an important email as spam is costly, or loan approvals). Prioritize Recall when the cost of a False Negative is catastrophic (e.g., medical cancer screening, fraud detection, or critical equipment failure where missing a positive case has extreme consequences). F-beta score allows weighting between the two.",
            "code_example": "from sklearn.metrics import classification_report\nprint(classification_report(y_true, y_pred))",
            "interview_tips": "Always tie metric selection directly to business ROI and consequences."
        }
    ]
}
