# Workflow: Run Full Stack Locally (pointed at Sepolia)

Trigger phrase: "run everything" or "/run-full-stack"

Steps:
1. Confirm packages/backend/.env exists with RPC_URL pointing at a Sepolia provider
   (Alchemy/Infura), and ATTESTOR_PRIVATE_KEY / ISSUER_PRIVATE_KEY set
2. Confirm packages/frontend/.env.local exists with NEXT_PUBLIC_API_URL=http://localhost:4000
3. From project root: npm run dev
   (runs backend on :4000 and frontend on :3000 concurrently)
4. Verify backend health: curl http://localhost:4000/health — confirm it shows Sepolia
   contract addresses and non-null wallet addresses
5. Open http://localhost:3000 in the built-in browser preview
