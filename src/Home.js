import React, { useState, useEffect } from 'react';
import api from './api';
import './scrollbar.css';
import { Doughnut, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import "./App.css";

const Home = () => {
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    date: '',
    description: '',
    is_income: false,
  });
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [monthlyTransactions, setMonthlyTransactions] = useState({ income: [], expenses: [] });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedCategoryName, setSelectedCategoryName] = useState(''); // New state for selected category name

  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  useEffect(() => {
    const categoriesMap = categories.reduce((map, category) => {
      map[category.id] = category.name;
      return map;
    }, {});
    setCategoryMap(categoriesMap);
  }, [categories]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchExpensesByCategory = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        try {
          const response = await api.get('/expenses_by_category/', {
            params: { user_id: userId },
            headers: { 'X-User-ID': userId }
          });
          setExpensesByCategory(response.data);
        } catch (error) {
          console.error('Error fetching expenses by category:', error);
        }
      }
    };

    const fetchTransactions = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        try {
          const response = await api.get('/transactions/', {
            params: { user_id: userId },
            headers: { 'X-User-ID': userId }
          });
          setTransactions(response.data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      }
    };

    if (userId) {
      fetchExpensesByCategory();
      fetchTransactions();
    }
  }, [userId]);

  useEffect(() => {
    const fetchMonthlyTransactions = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        try {
          const response = await api.get('/get_monthly_transactions/', {
            params: { user_id: userId, month: selectedMonth + 1 }, 
          });
          const transactions = response.data;
          const income = [];
          const expenses = [];

          transactions.forEach(transaction => {
            if (transaction.is_income) {
              income.push(transaction.amount);
            } else {
              expenses.push(transaction.amount);
            }
          });

          setMonthlyTransactions({ income, expenses });
        } catch (error) {
          console.error('Error fetching monthly transactions:', error);
        }
      }
    };

    if (userId) {
      fetchMonthlyTransactions();
    }
  }, [selectedMonth, userId]);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if (event.target.name === 'category') {
      const selectedCategory = categories.find(category => category.name === value);
      if (selectedCategory) {
        setFormData({ ...formData, category_id: selectedCategory.id });
        setSelectedCategoryName(selectedCategory.name); // Update selected category name
      }
    } else {
      setFormData({ ...formData, [event.target.name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userId) {
      try {
        const response = await api.post('/transactions/', {
          amount: formData.amount,
          category_id: formData.category_id,
          description: formData.description,
          is_income: formData.is_income,
          date: formData.date,
        }, {
          params: { user_id: userId },
          headers: { 'X-User-ID': userId }
        });
        setTransactions([...transactions, response.data]);
        setFormData({
          amount: '',
          category_id: '',
          date: '',
          description: '',
          is_income: false,
        });
        setSelectedCategoryName(''); // Reset selected category name
        await updateChartData();
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    }
  };

  const updateChartData = async () => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      try {
        const response = await api.get('/expenses_by_category/', {
          params: { user_id: userId },
          headers: { 'X-User-ID': userId }
        });
        setExpensesByCategory(response.data);
        fetchMonthlyTransactions(); 
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
  };

  const fetchMonthlyTransactions = async () => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      try {
        const response = await api.get('/get_monthly_transactions/', {
          params: { user_id: userId, month: selectedMonth + 1 }, 
        });
        const transactions = response.data;
        const income = [];
        const expenses = [];

        transactions.forEach(transaction => {
          if (transaction.is_income) {
            income.push(transaction.amount);
          } else {
            expenses.push(transaction.amount);
          }
        });

        setMonthlyTransactions({ income, expenses });
      } catch (error) {
        console.error('Error fetching monthly transactions:', error);
      }
    }
  };

  useEffect(() => {
    fetchMonthlyTransactions();
  }, [selectedMonth]);

  return (
    <div style={{ backgroundColor: '#424769', minHeight: '150vh' }}>
      <nav className="navbar navbar-dark" style={{ backgroundColor: '#2D3250' }}>
        <div className='container-fluid'>
          <a className='navbar-brand' href='google.com' style={{ fontSize: "30px" }}>
            <span style={{ color: '#FDBF50' }}>Cash</span>Flow
          </a>
          <a className='navbar-brand' href='google.com'>
            Logout
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Logo" width="30" height="30" className="d-inline-block align-text-top" style={{ marginLeft: '10px' }} />
          </a>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mx-auto my-2">
            <div className="transaction-block rounded-3 p-3 mt-3" style={{ height: '570px', backgroundColor: '#2D3250' }}>
              <h2 className="text-white mb-3" style={{ textAlign: 'center' }}>Добавить транзакцию</h2><hr style={{ backgroundColor: '#FFFFFF', height: '2px' }}></hr>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="amount" className="form-label" style={{ color: 'white' }}>
                    Сумма
                  </label>
                  <input type="number" className="form-control" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="form-label" style={{ color: 'white' }}>
                    Категория
                  </label>
                  <select className="form-select" id="category" name="category" value={selectedCategoryName} onChange={handleInputChange}>
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="form-label" style={{ color: 'white' }}>
                    Описание
                  </label>
                  <input type="text" className="form-control" id="description" name="description" value={formData.description} onChange={handleInputChange} />
                </div>
                <div className="mb-4 form-check">
                  <input type="checkbox" className="form-check-input" id="is_income" name="is_income" checked={formData.is_income} onChange={handleInputChange} />
                  <label className="form-check-label" htmlFor="is_income" style={{ color: 'white' }}>
                    Доход?
                  </label>
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="form-label" style={{ color: 'white' }}>
                    Дата
                  </label>
                  <input type="date" className="form-control" id="date" name="date" value={formData.date} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-light" style={{ backgroundColor: '#FDBF50' }}>
                  Добавить
                </button>
              </form>
            </div>
          </div>
          <div className="col-12 col-md-6 mx-auto my-2">
            <div className="transaction-block rounded-3 p-3 mt-3" style={{ height: '570px', backgroundColor: '#2D3250' }}>
              <h2 className="text-white mb-3" style={{ textAlign: 'center' }}>История транзакций</h2><hr style={{ backgroundColor: '#FFFFFF', height: '2px' }}></hr>
              <div className="table-responsive" style={{ maxHeight: '90%', overflowY: 'auto' }}>
                <table className="table table-striped table-bordered table-hover mt-3">
                  <thead>
                    <tr style={{ color: 'white' }}>
                      <th>Сумма</th>
                      <th>Категория</th>
                      <th>Доход?</th>
                      <th>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} style={{ color: 'white' }}>
                        <td>{transaction.amount}</td>
                        <td>{categoryMap[transaction.category_id]}</td>
                        <td>{transaction.is_income ? 'Да' : 'Нет'}</td>
                        <td>{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mx-auto my-2">
            <div className="transaction-block rounded-3 p-4 mt-3" style={{ height: '570px', backgroundColor: '#2D3250' }}>
              <h2 className="text-white mb-3" style={{ textAlign: 'center' }}>Доходы и расходы</h2><hr style={{ backgroundColor: '#FFFFFF', height: '2px' }}></hr>
              <div className="d-flex justify-content-center" style={{ maxWidth: '100%', maxHeight: '400px' }}>
                <Bar
                  data={{
                    labels: ['Доходы и расходы'],
                    datasets: [
                      {
                        label: 'Доходы',
                        data: [monthlyTransactions.income.reduce((a, b) => a + b, 0)], 
                        backgroundColor: '#900F8C'
                      },
                      {
                        label: 'Расходы',
                        data: [monthlyTransactions.expenses.reduce((a, b) => a + b, 0)], 
                        backgroundColor: '#11DCC4'
                      }
                    ]
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mx-auto my-2">
            <div className="transaction-block rounded-3 p-4 mt-3" style={{ height: '570px', backgroundColor: '#2D3250' }}>
              <h2 className="text-white mb-3" style={{ textAlign: 'center' }}>Сферы затрат</h2><hr style={{ backgroundColor: '#FFFFFF', height: '2px' }}></hr>
              <div className="d-flex justify-content-center" style={{ maxWidth: '100%', maxHeight: '400px' }}>
                <Doughnut data={{
                  labels: Object.keys(expensesByCategory),
                  datasets: [{
                    data: Object.values(expensesByCategory),
                    backgroundColor: ['#0AFB60', '#9D00C6', '#F04579', '#00FFED', '#FFE031'],
                    borderRadius: 10,
                    hoverBackgroundColor: ['#0AFB60', '#9D00C6', '#F04579', '#00FFED', '#FFE031']
                  }]
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
