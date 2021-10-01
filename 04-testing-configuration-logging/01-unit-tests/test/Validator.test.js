const Validator = require('../Validator');
const expect = require('chai').expect;
const validatorRules = require('./validatorRules.json');

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    before(() => {
      this.validator = new Validator(validatorRules);
    });

    it('Validator reports short string value', () => {
      const errors = this.validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too short, expect 10, got 6');
    });
    it('Validator reports long string value', () => {
      const errors = this.validator.validate({
        name: 'LalalasdasdasdasdasaLalalasdasdasdasdasaLalalasdasdasdasdasa',
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too long, expect 20, got 60');
    });
    it('Validator reports if not string passed to string field', () => {
      const errors = this.validator.validate({
        name: 123123,
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('expect string, got number');
    });
    it('Validator reports short number value', () => {
      const errors = this.validator.validate({
        age: 1,
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too little, expect 18, got 1');
    });
    it('Validator reports long number value', () => {
      const errors = this.validator.validate({
        age: 101,
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too big, expect 18, got 101');
    });
    it('Validator reports if not number passed to number field', () => {
      const errors = this.validator.validate({
        age: '123',
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('expect number, got string');
    });
  });
});
