// Investment API for millionaire wealth management
import { NextApiRequest, NextApiResponse } from 'next';

// Mock database - in production, use PostgreSQL/MongoDB
let investments = [
  {
    id: '1',
    name: 'Sustainable Energy Portfolio',
    type: 'ESG Fund',
    amount: 250000,
    currentValue: 287500,
    return: 15.0,
    riskLevel: 'Medium',
    category: 'Renewable Energy',
    lastUpdated: new Date(),
    isConscious: true
  },
  {
    id: '2',
    name: 'Impact Real Estate',
    type: 'Real Estate',
    amount: 500000,
    currentValue: 545000,
    return: 9.0,
    riskLevel: 'Low',
    category: 'Sustainable Housing',
    lastUpdated: new Date(),
    isConscious: true
  },
  {
    id: '3',
    name: 'Tech Innovation Fund',
    type: 'Growth Stock',
    amount: 300000,
    currentValue: 378000,
    return: 26.0,
    riskLevel: 'High',
    category: 'Technology',
    lastUpdated: new Date(),
    isConscious: false
  }
];

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Get all investments with filtering
      const { category, riskLevel, conscious } = req.query;
      let filteredInvestments = investments;

      if (category) {
        filteredInvestments = filteredInvestments.filter(inv => 
          inv.category.toLowerCase().includes(category.toLowerCase())
        );
      }

      if (riskLevel) {
        filteredInvestments = filteredInvestments.filter(inv => 
          inv.riskLevel.toLowerCase() === riskLevel.toLowerCase()
        );
      }

      if (conscious !== undefined) {
        filteredInvestments = filteredInvestments.filter(inv => 
          inv.isConscious === (conscious === 'true')
        );
      }

      res.status(200).json({
        investments: filteredInvestments,
        totalValue: filteredInvestments.reduce((sum, inv) => sum + inv.currentValue, 0),
        totalReturn: filteredInvestments.reduce((sum, inv) => sum + (inv.currentValue - inv.amount), 0)
      });
      break;

    case 'POST':
      // Add new investment
      const newInvestment = {
        id: Date.now().toString(),
        name: req.body.name,
        type: req.body.type,
        amount: req.body.amount,
        currentValue: req.body.amount, // Initially same as amount
        return: 0,
        riskLevel: req.body.riskLevel,
        category: req.body.category,
        lastUpdated: new Date(),
        isConscious: req.body.isConscious || false
      };

      investments.push(newInvestment);
      res.status(201).json(newInvestment);
      break;

    case 'PUT':
      // Update investment
      const { id } = req.query;
      const investmentIndex = investments.findIndex(inv => inv.id === id);
      
      if (investmentIndex === -1) {
        return res.status(404).json({ error: 'Investment not found' });
      }

      investments[investmentIndex] = {
        ...investments[investmentIndex],
        ...req.body,
        lastUpdated: new Date()
      };

      res.status(200).json(investments[investmentIndex]);
      break;

    case 'DELETE':
      // Delete investment
      const deleteId = req.query.id;
      investments = investments.filter(inv => inv.id !== deleteId);
      res.status(200).json({ message: 'Investment deleted successfully' });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}