# 🤝 Contributing to AERO UTAMU Smart Baggage Tracker

Thank you for your interest in contributing to the AERO UTAMU Smart Baggage Tracker! This document provides guidelines for contributors.

## 🚀 Quick Start for Contributors

### Prerequisites
- **Python 3.12+** (for backend development)
- **Node.js 18+** (for frontend development)
- **Git** for version control
- Basic knowledge of Django and Next.js

### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd AeroUTAMUSmartBaggageTracker

# Run the automated setup script
./setup.sh

# Or set up manually (see README.md)
```

## 🏗️ Project Structure

```
├── backend/                 # Django REST API
│   ├── baggage_tracker/    # Django project settings
│   ├── tracking/           # Main Django app
│   ├── requirements-*.txt  # Python dependencies
│   └── manage.py          # Django management
├── frontend/               # Next.js application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Node.js dependencies
├── sample_qr_codes/       # Demo QR codes for testing
└── setup.sh              # Automated setup script
```

## 🛠️ Development Workflow

### Backend (Django) Development

1. **Activate the virtual environment**
   ```bash
   cd backend
   source .venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements-dev.txt
   ```

3. **Run development server**
   ```bash
   python manage.py runserver
   ```

4. **Run tests**
   ```bash
   python manage.py test
   ```

5. **Create migrations (if you modify models)**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

### Frontend (Next.js) Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Type checking**
   ```bash
   npm run type-check
   ```

4. **Linting**
   ```bash
   npm run lint
   ```

## 🎯 Contribution Areas

### High Priority
- **Performance Optimization**: Improve API response times
- **Mobile UX**: Enhance mobile scanning experience
- **Real-time Features**: Expand WebSocket functionality
- **Testing**: Add comprehensive test coverage
- **Documentation**: Improve code documentation

### Feature Requests
- **Push Notifications**: Browser notifications for updates
- **Email Integration**: Automated email alerts
- **Advanced Analytics**: Detailed reporting features
- **Multi-language**: Internationalization support
- **API Integrations**: Connect with airport systems

### Bug Fixes
- Check GitHub Issues for reported bugs
- Test on different browsers and devices
- Improve error handling and user feedback

## 📝 Coding Standards

### Backend (Python/Django)
- Follow **PEP 8** style guidelines
- Use **Django best practices**
- Write **docstrings** for functions and classes
- Use **type hints** where appropriate
- Keep **models normalized** and efficient

Example:
```python
def update_baggage_status(
    baggage_id: str, 
    status: str, 
    location: str = "",
    notes: str = ""
) -> Baggage:
    """
    Update baggage status with location and notes.
    
    Args:
        baggage_id: UUID of the baggage item
        status: New status from STATUS_CHOICES
        location: Optional location information
        notes: Optional staff notes
        
    Returns:
        Updated Baggage instance
        
    Raises:
        Baggage.DoesNotExist: If baggage not found
    """
    # Implementation here
```

### Frontend (TypeScript/React)
- Use **TypeScript** for all new code
- Follow **React best practices**
- Use **functional components** with hooks
- Keep **components small** and focused
- Use **proper error boundaries**

Example:
```typescript
interface BaggageStatusProps {
  baggage: Baggage;
  onStatusUpdate: (id: string, status: BaggageStatus) => void;
}

export const BaggageStatus: React.FC<BaggageStatusProps> = ({ 
  baggage, 
  onStatusUpdate 
}) => {
  // Component implementation
};
```

## 🧪 Testing Guidelines

### Backend Testing
- Write **unit tests** for models and views
- Use Django's **TestCase** for database tests
- Mock external dependencies
- Aim for **80%+ code coverage**

```python
from django.test import TestCase
from tracking.models import Baggage

class BaggageModelTest(TestCase):
    def test_baggage_creation(self):
        baggage = Baggage.objects.create(
            passenger_name="Test User",
            flight_number="TK123"
        )
        self.assertEqual(baggage.current_status, "CHECKED_IN")
```

### Frontend Testing
- Write **component tests** with React Testing Library
- Test **user interactions** and accessibility
- Mock API calls appropriately
- Test **responsive design** on different screen sizes

## 📋 Pull Request Process

### Before Submitting
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Test your changes**
   ```bash
   # Backend tests
   cd backend && python manage.py test
   
   # Frontend tests
   cd frontend && npm run type-check && npm run lint
   ```

3. **Update documentation** if needed

### Pull Request Template
```markdown
## 🎯 Description
Brief description of the changes

## 🔄 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

## 📱 Screenshots (if applicable)
Add screenshots for UI changes

## 🔗 Related Issues
Closes #(issue number)
```

### Review Process
1. All PRs require **at least one review**
2. **Automated tests** must pass
3. **No merge conflicts** with main branch
4. **Documentation** must be updated for new features

## 🐛 Bug Reports

### Bug Report Template
```markdown
## 🐛 Bug Description
Clear description of the bug

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## 🎯 Expected Behavior
What should happen

## 📱 Environment
- OS: [e.g., Windows 10, macOS, Ubuntu]
- Browser: [e.g., Chrome 91, Firefox 89]
- Device: [e.g., iPhone 12, Desktop]

## 📸 Screenshots
Add screenshots if helpful
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## 🚀 Feature Description
Clear description of the proposed feature

## 🎯 Problem it Solves
What problem does this feature address?

## 💭 Proposed Solution
Describe your proposed solution

## 🔄 Alternative Solutions
Any alternative approaches considered?

## 📊 Additional Context
Any other context or screenshots
```

## 🏷️ Release Process

### Version Numbering
We follow **Semantic Versioning** (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Tagged release created

## 🤝 Community Guidelines

### Code of Conduct
- Be **respectful** and **inclusive**
- **Help others** learn and grow
- **Provide constructive** feedback
- **Focus on what's best** for the community

### Communication
- Use **clear, descriptive** commit messages
- **Comment your code** appropriately
- **Ask questions** if unsure
- **Share knowledge** and best practices

## 📚 Resources

### Learning Resources
- **Django Documentation**: https://docs.djangoproject.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **React Documentation**: https://reactjs.org/docs/

### Project Resources
- **Main README**: Comprehensive setup and usage guide
- **API Documentation**: Backend API endpoints and examples
- **Frontend README**: Frontend-specific documentation
- **Sample Data**: Use passenger_accounts.txt for testing

## 🎉 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **Project documentation** for major features

Thank you for contributing to the AERO UTAMU Smart Baggage Tracker! ✈️

---

**Questions?** Open an issue or reach out to the maintainers!